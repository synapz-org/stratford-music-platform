# Sample Implementation - Stratford Music Platform

This document provides working code examples for the core functionality of the Stratford Live Music & Arts Event Magazine platform.

## Backend API Implementation

### 1. Event Management Routes (`backend/src/routes/events.ts`)

```typescript
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get today's events
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const events = await prisma.event.findMany({
      where: {
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: 'PUBLISHED',
      },
      include: {
        venue: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching today\'s events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get upcoming events
router.get('/upcoming', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(days));

    const events = await prisma.event.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        status: 'PUBLISHED',
      },
      include: {
        venue: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event (venue only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, startTime, endTime, price, category } = req.body;
    const userId = req.user.userId;

    // Check if user is a venue
    const venue = await prisma.venue.findUnique({
      where: { userId },
    });

    if (!venue) {
      return res.status(403).json({ error: 'Only venues can create events' });
    }

    const event = await prisma.event.create({
      data: {
        venueId: venue.id,
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        price: price ? parseFloat(price) : null,
        category,
        status: 'DRAFT',
      },
      include: {
        venue: true,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event (venue only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, price, category, status } = req.body;
    const userId = req.user.userId;

    // Check if user owns the venue for this event
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.venue.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        price: price ? parseFloat(price) : undefined,
        category,
        status,
      },
      include: {
        venue: true,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

export default router;
```

### 2. Authentication Middleware (`backend/src/middleware/auth.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
```

## Frontend Implementation

### 1. Event List Component (`frontend/src/components/EventList.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  price: number | null;
  category: string;
  venue: {
    name: string;
    address: string;
    phone: string | null;
  };
}

interface EventListProps {
  filter?: 'today' | 'upcoming';
  category?: string;
}

const EventList: React.FC<EventListProps> = ({ filter = 'today', category }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const endpoint = filter === 'today' ? '/api/events/today' : '/api/events/upcoming';
        const response = await axios.get(`${process.env.REACT_APP_API_URL}${endpoint}`);
        
        let filteredEvents = response.data;
        
        if (category) {
          filteredEvents = filteredEvents.filter((event: Event) => 
            event.category === category
          );
        }
        
        setEvents(filteredEvents);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter, category]);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      LIVE_MUSIC: 'bg-blue-500',
      STANDUP_COMEDY: 'bg-purple-500',
      CLASSICAL_MUSIC: 'bg-green-500',
      THEATRE: 'bg-red-500',
      ART_GALLERY: 'bg-yellow-500',
      LITERATURE: 'bg-indigo-500',
      RESTAURANT_EVENT: 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {filter === 'today' 
            ? 'No events scheduled for today. Check back tomorrow!' 
            : 'No upcoming events found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getCategoryColor(event.category)}`}>
                    {event.category.replace('_', ' ')}
                  </span>
                  {event.price && (
                    <span className="text-sm font-medium text-green-600">
                      ${event.price}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {event.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Date:</span> {formatDate(event.startTime)}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{event.venue.name}</p>
                  <p className="text-sm text-gray-500">{event.venue.address}</p>
                  {event.venue.phone && (
                    <p className="text-sm text-gray-500">{event.venue.phone}</p>
                  )}
                </div>
                
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
```

### 2. Venue Dashboard Component (`frontend/src/components/VenueDashboard.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  price: number | null;
  category: string;
  status: string;
}

const VenueDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    price: '',
    category: 'LIVE_MUSIC',
  });

  useEffect(() => {
    fetchVenueEvents();
  }, []);

  const fetchVenueEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/venue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching venue events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        price: '',
        category: 'LIVE_MUSIC',
      });
      setShowForm(false);
      fetchVenueEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Venue Dashboard</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Event'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="LIVE_MUSIC">Live Music</option>
                  <option value="STANDUP_COMEDY">Stand-up Comedy</option>
                  <option value="CLASSICAL_MUSIC">Classical Music</option>
                  <option value="THEATRE">Theatre</option>
                  <option value="ART_GALLERY">Art Gallery</option>
                  <option value="LITERATURE">Literature</option>
                  <option value="RESTAURANT_EVENT">Restaurant Event</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (optional)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Events</h2>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No events created yet. Add your first event above!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {events.map((event) => (
              <div key={event.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{new Date(event.startTime).toLocaleDateString()}</span>
                      <span>{new Date(event.startTime).toLocaleTimeString()}</span>
                      {event.price && <span>${event.price}</span>}
                      <span className={`px-2 py-1 text-xs rounded ${
                        event.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDashboard;
```

## Mobile App Implementation

### 1. Today's Events Screen (`mobile/src/screens/TodayEventsScreen.tsx`)

```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  price: number | null;
  category: string;
  venue: {
    name: string;
    address: string;
    phone: string | null;
  };
}

const TodayEventsScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/events/today`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to load today\'s events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      LIVE_MUSIC: '#3B82F6',
      STANDUP_COMEDY: '#8B5CF6',
      CLASSICAL_MUSIC: '#10B981',
      THEATRE: '#EF4444',
      ART_GALLERY: '#F59E0B',
      LITERATURE: '#6366F1',
      RESTAURANT_EVENT: '#EC4899',
    };
    return colors[category] || '#6B7280';
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <Text style={styles.categoryText}>
              {item.category.replace('_', ' ')}
            </Text>
          </View>
        </View>
        {item.price && (
          <Text style={styles.priceText}>${item.price}</Text>
        )}
      </View>
      
      <Text style={styles.eventDescription}>{item.description}</Text>
      
      <View style={styles.eventDetails}>
        <Text style={styles.timeText}>
          {formatTime(item.startTime)} - {formatTime(item.endTime)}
        </Text>
      </View>
      
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{item.venue.name}</Text>
        <Text style={styles.venueAddress}>{item.venue.address}</Text>
        {item.venue.phone && (
          <Text style={styles.venuePhone}>{item.venue.phone}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading today's events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Events</Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No events scheduled for today. Check back tomorrow!
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  eventDetails: {
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  venueInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  venueName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  venueAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  venuePhone: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default TodayEventsScreen;
```

## Database Seeding Script

### Complete Seeding Script (`backend/src/seed.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stratfordmusic.com' },
    update: {},
    create: {
      email: 'admin@stratfordmusic.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create sample venues
  const venues = [
    {
      email: 'stratfordmusichall@stratfordmusic.com',
      name: 'Stratford Music Hall',
      address: '123 Music Street, Stratford, ON',
      phone: '519-555-0123',
      website: 'https://stratfordmusichall.com',
      description: 'Premier live music venue in Stratford',
      capacity: 200,
      amenities: ['Bar', 'Parking', 'Accessibility'],
    },
    {
      email: 'theatre@stratfordmusic.com',
      name: 'Stratford Theatre',
      address: '456 Shakespeare Ave, Stratford, ON',
      phone: '519-555-0456',
      website: 'https://stratfordtheatre.com',
      description: 'Historic theatre venue for performances',
      capacity: 150,
      amenities: ['Concessions', 'Parking', 'Accessibility'],
    },
    {
      email: 'jazzclub@stratfordmusic.com',
      name: 'Stratford Jazz Club',
      address: '789 Jazz Lane, Stratford, ON',
      phone: '519-555-0789',
      website: 'https://stratfordjazzclub.com',
      description: 'Intimate jazz venue with great acoustics',
      capacity: 80,
      amenities: ['Bar', 'Food', 'Intimate Setting'],
    },
  ];

  const createdVenues = [];
  for (const venueData of venues) {
    const venueUser = await prisma.user.create({
      data: {
        email: venueData.email,
        passwordHash: await bcrypt.hash('venue123', 10),
        name: venueData.name,
        role: 'VENUE',
      },
    });

    const venue = await prisma.venue.create({
      data: {
        userId: venueUser.id,
        name: venueData.name,
        address: venueData.address,
        phone: venueData.phone,
        website: venueData.website,
        description: venueData.description,
        capacity: venueData.capacity,
        amenities: venueData.amenities,
      },
    });

    createdVenues.push(venue);
    console.log('Created venue:', venue.name);
  }

  // Create sample events
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const events = [
    {
      venueId: createdVenues[0].id,
      title: 'Jazz Night with Local Artists',
      description: 'An evening of smooth jazz featuring local Stratford musicians. Enjoy live music in an intimate setting.',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0),
      price: 25.00,
      category: 'LIVE_MUSIC',
      status: 'PUBLISHED',
    },
    {
      venueId: createdVenues[0].id,
      title: 'Rock & Roll Revival',
      description: 'Classic rock hits performed by local bands. A night of high-energy music and great vibes.',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 30),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 22, 30),
      price: 30.00,
      category: 'LIVE_MUSIC',
      status: 'PUBLISHED',
    },
    {
      venueId: createdVenues[1].id,
      title: 'Shakespeare in Music',
      description: 'Classical music inspired by Shakespeare\'s works. A unique blend of theatre and classical music.',
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 30),
      price: 35.00,
      category: 'CLASSICAL_MUSIC',
      status: 'PUBLISHED',
    },
    {
      venueId: createdVenues[2].id,
      title: 'Comedy Night',
      description: 'Stand-up comedy featuring local and touring comedians. A night of laughter and entertainment.',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 30),
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 22, 0),
      price: 15.00,
      category: 'STANDUP_COMEDY',
      status: 'PUBLISHED',
    },
    {
      venueId: createdVenues[2].id,
      title: 'Smooth Jazz Evening',
      description: 'Relaxing jazz music perfect for a romantic evening or casual night out.',
      startTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 20, 0),
      endTime: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate(), 23, 0),
      price: 20.00,
      category: 'LIVE_MUSIC',
      status: 'PUBLISHED',
    },
  ];

  for (const eventData of events) {
    await prisma.event.create({
      data: eventData,
    });
    console.log('Created event:', eventData.title);
  }

  // Create sample magazine issue
  const magazineIssue = await prisma.magazineIssue.create({
    data: {
      title: 'Stratford Music & Arts - January 2024',
      monthYear: 'January 2024',
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Create sample articles
  const articles = [
    {
      issueId: magazineIssue.id,
      title: 'The Rise of Local Music in Stratford',
      content: 'Stratford has become a hub for local musicians, with venues popping up throughout the city...',
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    {
      issueId: magazineIssue.id,
      title: 'Interview: Local Jazz Artist Sarah Johnson',
      content: 'We sat down with local jazz sensation Sarah Johnson to discuss her musical journey...',
      authorId: admin.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  ];

  for (const articleData of articles) {
    await prisma.article.create({
      data: articleData,
    });
    console.log('Created article:', articleData.title);
  }

  // Create sample playlist
  const playlist = await prisma.playlist.create({
    data: {
      curatorId: admin.id,
      title: 'Stratford Local Artists Mix',
      description: 'A curated playlist featuring the best local Stratford musicians',
      tracks: [
        { title: 'Stratford Nights', artist: 'Local Jazz Quartet', duration: '4:30' },
        { title: 'Shakespeare\'s Sonnet', artist: 'Classical Ensemble', duration: '3:45' },
        { title: 'Downtown Blues', artist: 'Blues Brothers', duration: '5:20' },
      ],
    },
  });

  console.log('Created playlist:', playlist.title);
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

This sample implementation provides a solid foundation for the Stratford music platform with:

1. **Complete backend API** with authentication, event management, and venue operations
2. **Responsive frontend** with event listings, filtering, and venue dashboard
3. **Mobile app** with today's events screen and pull-to-refresh functionality
4. **Database seeding** with sample data for testing

The implementation focuses on the core features mentioned in the PDF:
- Daily event listings prominently displayed
- Venue management and event submission
- User authentication and role-based access
- Event categorization and filtering
- Responsive design for web and mobile

This provides a working prototype that can be extended with additional features like payment processing, content management, and advanced UI/UX enhancements. 