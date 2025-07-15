# Stratford Live Music & Arts Event Magazine Platform

A comprehensive digital platform to promote Stratford as a destination music city, featuring a monthly magazine, integrated website, mobile app, and event management system.

## 🎯 Project Overview

This platform serves as the digital backbone for Stratford's music and arts scene, providing:

- **Daily Event Listings** - Real-time event information prominently displayed
- **Venue Management** - Event submission and payment system for venues
- **Artist Promotion** - Features, interviews, and curated playlists
- **Magazine Integration** - Digital magazine with content management
- **Mobile App** - Native mobile experience for event discovery

## 🏗️ Architecture

This is a monorepo containing:

- **`backend/`** - Node.js/Express API server with PostgreSQL database
- **`frontend/`** - React/TypeScript website with Tailwind CSS
- **`mobile/`** - React Native/Expo mobile application
- **`shared/`** - Shared TypeScript types and API client
- **`docs/`** - Project documentation
- **`scripts/`** - Build and deployment scripts

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- PostgreSQL 15+
- Expo CLI (for mobile development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dwbarnes/stratford-music-platform.git
   cd stratford-music-platform
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp mobile/.env.example mobile/.env
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API on http://localhost:3001
- Frontend website on http://localhost:3000
- Mobile app with Expo (scan QR code)

## 📁 Project Structure

```
stratford-music-platform/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Authentication, validation
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── prisma/             # Database schema and migrations
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React website
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API integration
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   ├── package.json
│   └── tsconfig.json
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── components/     # Mobile UI components
│   │   ├── screens/        # App screens
│   │   ├── navigation/     # Navigation setup
│   │   ├── services/       # API integration
│   │   └── utils/          # Helper functions
│   ├── app.json            # Expo configuration
│   ├── package.json
│   └── tsconfig.json
├── shared/                 # Shared code
│   ├── types/              # TypeScript interfaces
│   ├── api-client/         # Shared API client
│   └── package.json
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
├── package.json            # Root workspace configuration
└── README.md
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start all development servers
- `npm run dev:backend` - Start backend API only
- `npm run dev:frontend` - Start frontend website only
- `npm run dev:mobile` - Start mobile app only
- `npm run build` - Build all production assets
- `npm run test` - Run all tests
- `npm run lint` - Run linting across all packages
- `npm run db:setup` - Set up database schema
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and reseed database

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/stratford_music"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

#### Mobile (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_ENVIRONMENT=development
```

## 🗄️ Database Schema

The platform uses PostgreSQL with Prisma ORM. Key entities include:

- **Users** - Admin, Venue, Artist, Reader roles
- **Venues** - Event venues with contact information
- **Events** - Live events with scheduling and pricing
- **Magazine Issues** - Monthly magazine publications
- **Articles** - Magazine content and features
- **Playlists** - Curated music playlists
- **Advertisements** - Paid advertising content

## 🔐 Authentication & Authorization

The platform uses JWT-based authentication with role-based access:

- **Admin** - Full system access
- **Venue** - Event management and venue operations
- **Artist** - Profile management and content creation
- **Reader** - Event browsing and magazine access

## 📱 Mobile App

The mobile app is built with React Native and Expo, featuring:

- **Today's Events** - Primary screen showing current day events
- **Event Details** - Full event information and venue details
- **Pull-to-Refresh** - Real-time event updates
- **Offline Support** - Basic functionality when offline
- **Push Notifications** - Event reminders and updates

## 🌐 Website Features

The website provides:

- **Responsive Design** - Works on all device sizes
- **Event Discovery** - Advanced filtering and search
- **Venue Dashboard** - Event management for venue owners
- **Magazine Archive** - Digital access to past issues
- **Playlist Integration** - Curated music discovery

## 🚀 Deployment

### Backend Deployment
- **Platform**: Vercel, Railway, or AWS
- **Database**: PostgreSQL (managed service)
- **Environment**: Production environment variables

### Frontend Deployment
- **Platform**: Vercel or Netlify
- **Build**: `npm run build`
- **Environment**: Production API URL

### Mobile App Deployment
- **Platform**: Expo Application Services (EAS)
- **Build**: `eas build`
- **Distribution**: App Store and Google Play

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the documentation in the `docs/` folder

## 🗺️ Roadmap

- [ ] Payment processing integration
- [ ] Advanced content management system
- [ ] Social media integration
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Offline-first mobile experience

---

**Built with ❤️ for the Stratford music and arts community** 