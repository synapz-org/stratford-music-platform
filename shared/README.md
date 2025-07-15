# Stratford Music Platform - Shared Types

Shared TypeScript types, interfaces, and utilities for the Stratford Music Platform.

## 📦 What's Included

- **Type Definitions**: Complete TypeScript interfaces for all platform entities
- **API Client**: Reusable HTTP client with authentication
- **Constants**: Shared constants and enums
- **Utilities**: Common utility types and functions

## 🚀 Features

- **Type Safety**: Full TypeScript support across all packages
- **API Integration**: Pre-built API client with error handling
- **Shared Constants**: Event categories, user roles, and status enums
- **Form Types**: Type-safe form data interfaces
- **Response Types**: Standardized API response formats

## 📋 Installation

This package is automatically available to other packages in the monorepo through npm workspaces.

## 🔧 Usage

### Importing Types

```typescript
import { 
  User, 
  Event, 
  Venue, 
  EventCategory, 
  UserRole 
} from '@stratford-music/shared';
```

### Using the API Client

```typescript
import { api, apiClient } from '@stratford-music/shared';

// Set authentication token
apiClient.setToken('your-jwt-token');

// Use pre-built API functions
const events = await api.events.getAll();
const todayEvents = await api.events.getToday();
const user = await api.auth.getProfile();

// Or use the client directly
const response = await apiClient.get('/events');
```

### Form Data Types

```typescript
import { EventFormData, VenueFormData } from '@stratford-music/shared';

const eventForm: EventFormData = {
  title: 'Live Jazz Night',
  description: 'An evening of smooth jazz',
  startTime: '2024-12-15T20:00:00Z',
  endTime: '2024-12-15T23:00:00Z',
  price: '25.00',
  category: 'LIVE_MUSIC',
  venueId: 'venue-id'
};
```

### Constants

```typescript
import { 
  EVENT_CATEGORIES, 
  USER_ROLES, 
  EVENT_STATUSES 
} from '@stratford-music/shared';

// Use in forms or filters
const categories = EVENT_CATEGORIES.map(cat => ({
  value: cat.value,
  label: cat.label
}));
```

## 📚 Type Definitions

### Core Entities

- **User**: User accounts with roles and profiles
- **Event**: Live music and arts events
- **Venue**: Event venues with details
- **MagazineIssue**: Digital magazine issues
- **Article**: Magazine articles
- **Playlist**: Curated music playlists
- **Advertisement**: Ad management

### API Types

- **ApiResponse**: Standard API response format
- **PaginatedResponse**: Paginated data responses
- **ApiError**: Error handling class
- **LoadingState**: Loading state management

### Form Types

- **EventFormData**: Event creation/editing forms
- **VenueFormData**: Venue registration forms
- **LoginRequest**: Authentication requests
- **RegisterRequest**: User registration

## 🔌 API Client

The shared package includes a complete API client with:

### Features

- **Authentication**: Automatic JWT token handling
- **Error Handling**: Standardized error responses
- **Type Safety**: Full TypeScript support
- **Request/Response Interceptors**: Customizable middleware

### Usage Examples

```typescript
import { api, ApiError } from '@stratford-music/shared';

// Authentication
try {
  const authResponse = await api.auth.login({
    email: 'user@example.com',
    password: 'password'
  });
  console.log('Logged in:', authResponse.data.user);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
  }
}

// Events
const events = await api.events.getAll({
  category: 'LIVE_MUSIC',
  date: '2024-12-15'
});

// Venues
const venues = await api.venues.getAll({
  search: 'Stratford'
});
```

## 🛠️ Development

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Clean Build

```bash
npm run clean
npm run build
```

## 📦 Exports

### Main Exports

```typescript
// Core types
export type { User, Event, Venue, MagazineIssue, Article, Playlist, Advertisement };

// API types
export type { ApiResponse, PaginatedResponse, ApiError };

// Form types
export type { EventFormData, VenueFormData, LoginRequest, RegisterRequest };

// Enums and constants
export { EVENT_CATEGORIES, USER_ROLES, EVENT_STATUSES };

// API client
export { apiClient, api, API_BASE_URL, API_ENDPOINTS };
```

### Type Categories

#### User & Authentication
- `User`, `UserRole`
- `AuthResponse`, `LoginRequest`, `RegisterRequest`

#### Events & Venues
- `Event`, `EventCategory`, `EventStatus`
- `Venue`, `CreateVenueRequest`
- `EventFormData`, `VenueFormData`

#### Content
- `MagazineIssue`, `Article`, `IssueStatus`, `ArticleStatus`
- `Playlist`, `PlaylistTrack`
- `Advertisement`, `AdType`, `PaymentStatus`

#### API & Utilities
- `ApiResponse`, `PaginatedResponse`, `ApiError`
- `LoadingState`, `EventFilters`, `VenueFilters`

## 🔗 Integration

This package is designed to work seamlessly with:

- **Backend**: Type-safe API responses
- **Frontend**: Form validation and state management
- **Mobile**: Shared business logic and types

## 📄 License

MIT License - see LICENSE file for details 