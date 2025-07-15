# Stratford Music Platform - Backend API

The backend API server for the Stratford Music Platform, built with Express.js, TypeScript, and Prisma.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Event Management**: CRUD operations for live music and arts events
- **Venue Management**: Venue registration and management
- **User Management**: Multi-role user system (Admin, Venue, Artist, Reader)
- **Magazine Content**: Digital magazine issue and article management
- **Playlists**: Curated music playlists by local artists
- **Advertisements**: Ad management system with payment tracking
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Rate limiting, CORS, helmet, input validation

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Docker (optional, for local development)

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/stratford_music?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"

# Optional: Logging
LOG_LEVEL="info"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Events

- `GET /api/events` - Get all events (with filtering)
- `GET /api/events/today` - Get today's events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Venue/Admin only)
- `PUT /api/events/:id` - Update event (Venue/Admin only)
- `DELETE /api/events/:id` - Delete event (Venue/Admin only)

### Venues

- `GET /api/venues` - Get all venues
- `GET /api/venues/:id` - Get single venue
- `POST /api/venues` - Create venue (authenticated users)
- `PUT /api/venues/:id` - Update venue (owner only)
- `DELETE /api/venues/:id` - Delete venue (owner only)

### Magazine

- `GET /api/magazine/issues` - Get all magazine issues
- `GET /api/magazine/issues/:id` - Get single magazine issue

### Playlists

- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get single playlist

### Advertisements

- `GET /api/advertisements` - Get all advertisements

### Users

- `GET /api/users` - Get all users (Admin only)

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **ADMIN**: Full access to all endpoints
- **VENUE**: Can manage their own venue and events
- **ARTIST**: Can create playlists and articles
- **READER**: Read-only access to public content

## 🗄️ Database Schema

The database includes the following main entities:

- **Users**: Authentication and user profiles
- **Venues**: Event venues with details
- **Events**: Live music and arts events
- **MagazineIssues**: Digital magazine issues
- **Articles**: Magazine articles
- **Playlists**: Curated music playlists
- **Advertisements**: Ad management

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Input Validation**: Request validation with express-validator
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT**: Secure token-based authentication

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set the following environment variables in production:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong secret for JWT signing
- `NODE_ENV` - Set to "production"
- `CORS_ORIGIN` - Allowed origins for CORS

## 📝 Sample Data

The database seeding script creates sample data including:

- Admin user: `admin@stratfordmusic.com` / `admin123`
- Venue owner: `venue@stratfordmusic.com` / `venue123`
- Artist: `artist@stratfordmusic.com` / `artist123`
- Reader: `reader@stratfordmusic.com` / `reader123`

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

MIT License - see LICENSE file for details 