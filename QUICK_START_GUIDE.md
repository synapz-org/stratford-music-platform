# Quick Start Guide - Stratford Music Platform

## Immediate Next Steps (This Week)

### 1. Project Setup
```bash
# Create project structure
mkdir stratford-music-platform
cd stratford-music-platform

# Initialize git repository
git init
git remote add origin <your-repo-url>

# Create project structure
mkdir backend frontend mobile docs
```

### 2. Backend & Database Setup

#### Install Dependencies
```bash
cd backend
npm init -y
npm install express prisma @prisma/client bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon @types/node typescript
```

#### Database Schema (Prisma)
Create `backend/prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         UserRole @default(READER)
  name         String?
  bio          String?
  phone        String?
  address      String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  venue        Venue?
  articles     Article[]
  playlists    Playlist[]
  advertisements Advertisement[]

  @@map("users")
}

model Venue {
  id          String   @id @default(cuid())
  userId      String   @unique
  name        String
  address     String
  phone       String?
  website     String?
  description String?
  capacity    Int?
  amenities   String[]
  createdAt   DateTime @default(now())

  // Relations
  user        User     @relation(fields: [userId], references: [id])
  events      Event[]

  @@map("venues")
}

model Event {
  id          String      @id @default(cuid())
  venueId     String
  title       String
  description String
  startTime   DateTime
  endTime     DateTime
  price       Decimal?
  category    EventCategory
  status      EventStatus @default(DRAFT)
  createdAt   DateTime    @default(now())

  // Relations
  venue       Venue       @relation(fields: [venueId], references: [id])

  @@map("events")
}

model MagazineIssue {
  id          String   @id @default(cuid())
  title       String
  monthYear   String
  coverImage  String?
  publishedAt DateTime?
  status      IssueStatus @default(DRAFT)
  createdAt   DateTime @default(now())

  // Relations
  articles    Article[]

  @@map("magazine_issues")
}

model Article {
  id            String   @id @default(cuid())
  issueId       String
  title         String
  content       String
  authorId      String
  featuredImage String?
  publishedAt   DateTime?
  status        ArticleStatus @default(DRAFT)
  createdAt     DateTime @default(now())

  // Relations
  issue         MagazineIssue @relation(fields: [issueId], references: [id])
  author        User          @relation(fields: [authorId], references: [id])

  @@map("articles")
}

model Playlist {
  id          String   @id @default(cuid())
  curatorId   String
  title       String
  description String?
  tracks      Json
  createdAt   DateTime @default(now())

  // Relations
  curator     User     @relation(fields: [curatorId], references: [id])

  @@map("playlists")
}

model Advertisement {
  id            String   @id @default(cuid())
  advertiserId  String
  issueId       String?
  adType        AdType
  content       String
  paymentStatus PaymentStatus @default(PENDING)
  createdAt     DateTime @default(now())

  // Relations
  advertiser    User     @relation(fields: [advertiserId], references: [id])

  @@map("advertisements")
}

enum UserRole {
  ADMIN
  VENUE
  ARTIST
  READER
}

enum EventCategory {
  LIVE_MUSIC
  STANDUP_COMEDY
  CLASSICAL_MUSIC
  THEATRE
  ART_GALLERY
  LITERATURE
  RESTAURANT_EVENT
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
}

enum IssueStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum AdType {
  BANNER
  SIDEBAR
  FEATURED
  CLASSIFIED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

### 3. Basic API Setup

#### Express Server (`backend/src/server.ts`)
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import venueRoutes from './routes/venues';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Authentication Routes (`backend/src/routes/auth.ts`)
```typescript
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: role || 'READER'
      }
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

### 4. Frontend Setup

#### React App Setup
```bash
cd ../frontend
npx create-react-app . --template typescript
npm install axios react-router-dom @types/react-router-dom
npm install tailwindcss @tailwindcss/forms
npx tailwindcss init
```

#### Basic Landing Page (`frontend/src/components/LandingPage.tsx`)
```typescript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  venue: {
    name: string;
    address: string;
  };
}

const LandingPage: React.FC = () => {
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/today`);
        setTodayEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Stratford Live Music & Arts
          </h1>
          <p className="text-xl text-gray-300">
            Discover today's events in Stratford's vibrant music scene
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6">
            Today's Events
          </h2>
          
          {loading ? (
            <div className="text-center text-white">Loading events...</div>
          ) : todayEvents.length === 0 ? (
            <div className="text-center text-gray-300">
              No events scheduled for today. Check back tomorrow!
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {todayEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>{new Date(event.startTime).toLocaleTimeString()}</p>
                    <p>{event.venue.name}</p>
                    <p>{event.venue.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
```

### 5. Mobile App Setup

#### React Native with Expo
```bash
cd ../mobile
npx create-expo-app . --template blank-typescript
npm install @react-navigation/native @react-navigation/stack
npm install axios react-query
npx expo install expo-location expo-notifications
```

#### Today's Events Screen (`mobile/src/screens/TodayEventsScreen.tsx`)
```typescript
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  venue: {
    name: string;
    address: string;
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

  const renderEvent = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventTime}>
        {new Date(item.startTime).toLocaleTimeString()}
      </Text>
      <Text style={styles.venueName}>{item.venue.name}</Text>
      <Text style={styles.venueAddress}>{item.venue.address}</Text>
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
          <Text style={styles.emptyText}>
            No events scheduled for today. Check back tomorrow!
          </Text>
        }
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
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
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
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default TodayEventsScreen;
```

### 6. Environment Variables

#### Backend (`.env`)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/stratford_music"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
```

#### Frontend (`.env`)
```env
REACT_APP_API_URL=http://localhost:3001
```

#### Mobile (`.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

### 7. Database Seeding

Create `backend/src/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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

  // Create sample venue
  const venueUser = await prisma.user.create({
    data: {
      email: 'venue@stratfordmusic.com',
      passwordHash: await bcrypt.hash('venue123', 10),
      name: 'Stratford Music Hall',
      role: 'VENUE',
    },
  });

  const venue = await prisma.venue.create({
    data: {
      userId: venueUser.id,
      name: 'Stratford Music Hall',
      address: '123 Music Street, Stratford, ON',
      phone: '519-555-0123',
      website: 'https://stratfordmusichall.com',
      description: 'Premier live music venue in Stratford',
      capacity: 200,
      amenities: ['Bar', 'Parking', 'Accessibility'],
    },
  });

  // Create sample events
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await prisma.event.createMany({
    data: [
      {
        venueId: venue.id,
        title: 'Jazz Night with Local Artists',
        description: 'An evening of smooth jazz featuring local Stratford musicians.',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 20, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 0),
        price: 25.00,
        category: 'LIVE_MUSIC',
        status: 'PUBLISHED',
      },
      {
        venueId: venue.id,
        title: 'Comedy Night',
        description: 'Stand-up comedy featuring local and touring comedians.',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 19, 30),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 22, 0),
        price: 15.00,
        category: 'STANDUP_COMEDY',
        status: 'PUBLISHED',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 8. Running the Application

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm start
```

#### Mobile
```bash
cd mobile
npx expo start
```

### 9. Next Steps

1. **Set up PostgreSQL database**
2. **Run database migrations**: `npx prisma migrate dev`
3. **Seed the database**: `npm run seed`
4. **Test the API endpoints**
5. **Build and test the frontend**
6. **Test the mobile app on device/simulator**

This quick start guide provides the foundation for a working prototype that demonstrates the core functionality of the Stratford music platform. The next phase would involve adding more advanced features like payment processing, content management, and enhanced UI/UX. 