# Quick Start Guide - Stratford Music & Arts Platform

## Immediate Next Steps

### 1. Project Setup (Today)

```bash
# Create project structure
mkdir stratford-music-platform
cd stratford-music-platform

# Initialize git repository
git init
git add .
git commit -m "Initial project setup"

# Create project structure
mkdir backend frontend mobile docs
```

### 2. Backend Setup (Day 1-2)

```bash
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken prisma @prisma/client stripe multer

# Install dev dependencies
npm install -D nodemon @types/node typescript ts-node

# Initialize Prisma
npx prisma init

# Create database schema
```

### 3. Database Setup

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
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  venues        Venue[]
  advertisements Advertisement[]
  payments      Payment[]
}

model Venue {
  id          String   @id @default(cuid())
  name        String
  address     String
  description String?
  contactInfo String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  events Event[]
  user   User   @relation(fields: [userId], references: [id])
  userId String
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String
  dateTime    DateTime
  duration    Int? // in minutes
  price       Float?
  category    String
  status      EventStatus @default(DRAFT)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  venue     Venue        @relation(fields: [venueId], references: [id])
  venueId   String
  images    EventImage[]
}

model EventImage {
  id       String @id @default(cuid())
  imageUrl String
  altText  String?
  
  event   Event  @relation(fields: [eventId], references: [id])
  eventId String
}

model Advertisement {
  id            String   @id @default(cuid())
  title         String
  content       String
  imageUrl      String?
  startDate     DateTime
  endDate       DateTime
  status        AdStatus @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id])
  userId String
}

model Payment {
  id           String   @id @default(cuid())
  amount       Float
  paymentMethod String
  status       PaymentStatus @default(PENDING)
  createdAt    DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  userId String
}

enum Role {
  USER
  VENUE_OWNER
  ADMIN
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
}

enum AdStatus {
  PENDING
  APPROVED
  REJECTED
  ACTIVE
  EXPIRED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

### 4. Basic API Setup

Create `backend/src/app.js`:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/events', require('./routes/events'));
app.use('/api/v1/venues', require('./routes/venues'));
app.use('/api/v1/ads', require('./routes/advertisements'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 5. Frontend Setup (Day 3-4)

```bash
cd ../frontend

# Create React app with TypeScript
npx create-react-app . --template typescript

# Install additional dependencies
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled react-query
```

### 6. Mobile App Setup (Day 5-6)

```bash
cd ../mobile

# Create React Native app
npx react-native init StratfordMusicApp --template react-native-template-typescript

# Install dependencies
npm install @react-navigation/native @react-navigation/stack axios react-native-maps
```

## Environment Variables

Create `.env` files for each component:

### Backend (.env)
```
DATABASE_URL="postgresql://username:password@localhost:5432/stratford_music"
JWT_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."
PORT=3001
```

### Frontend (.env)
```
REACT_APP_API_URL="http://localhost:3001/api/v1"
REACT_APP_STRIPE_PUBLIC_KEY="pk_test_..."
```

## Quick Development Commands

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start

# Mobile (iOS)
cd mobile
npx react-native run-ios

# Mobile (Android)
cd mobile
npx react-native run-android
```

## MVP Features to Implement First

### Backend (Week 1)
- [ ] User authentication (register/login)
- [ ] Basic CRUD for events
- [ ] Venue management
- [ ] Simple payment integration

### Frontend (Week 2)
- [ ] Landing page with today's events
- [ ] Event listing page
- [ ] Event detail page
- [ ] Basic admin dashboard

### Mobile (Week 3)
- [ ] Today's events screen
- [ ] Event list view
- [ ] Event detail view
- [ ] Basic navigation

## Testing Strategy

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Mobile tests
cd mobile
npm test
```

## Deployment Preparation

1. **Database**: Set up PostgreSQL on cloud platform
2. **Backend**: Deploy to Heroku/Railway/Render
3. **Frontend**: Deploy to Vercel/Netlify
4. **Mobile**: Prepare for app store submission

## Next Steps After Setup

1. **Database Migration**: Run `npx prisma migrate dev`
2. **Seed Data**: Create sample events and venues
3. **API Testing**: Use Postman/Insomnia to test endpoints
4. **Frontend Integration**: Connect React app to API
5. **Mobile Integration**: Connect React Native app to API
6. **Payment Testing**: Test Stripe integration
7. **Deploy MVP**: Deploy basic version for testing

This quick start guide will get you up and running with a basic prototype in the first week! 