# Stratford Music Platform - Frontend

A modern React web application for the Stratford Music Platform, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Responsive Design** for all devices
- **Dark/Light Theme** support
- **Authentication** system
- **Event Management** interface
- **Venue Directory**
- **Magazine Content**
- **Playlist Management**

## 📦 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **State Management**: React Context API
- **HTTP Client**: Axios (via shared package)

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

1. **Install dependencies** (from project root):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Footer.tsx      # Site footer
│   │   ├── EventCard.tsx   # Event display card
│   │   └── VenueCard.tsx   # Venue display card
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── EventsPage.tsx  # Events listing
│   │   ├── LoginPage.tsx   # Authentication
│   │   └── ...            # Other pages
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vercel.json           # Vercel deployment config
```

## 🎨 Design System

### Colors

- **Primary**: Blue gradient (`primary-500` to `primary-700`)
- **Secondary**: Purple gradient (`secondary-500` to `secondary-700`)
- **Accent**: Orange (`accent-500`)
- **Neutral**: Gray scale (`gray-50` to `gray-900`)

### Typography

- **Sans**: Inter (system fallback)
- **Serif**: Playfair Display (Georgia fallback)

### Components

- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Event cards, venue cards, content cards
- **Forms**: Input fields, textareas, selects
- **Badges**: Category and status indicators

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3001/api
```

### API Integration

The frontend uses the shared API client from `@stratford-music/shared`:

```typescript
import { api } from '@stratford-music/shared'

// Fetch events
const events = await api.events.getAll()

// Authenticate user
await api.auth.login({ email, password })
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables**:
   - `VITE_API_URL`: Your backend API URL
3. **Deploy automatically** on push to main branch

### Manual Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

## 🎯 Key Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- User profile management

### Event Management
- Browse all events
- Filter by category, date, venue
- Event details with full information
- Event creation (admin)

### Venue Directory
- Venue listings with details
- Venue search and filtering
- Venue management (admin)

### Magazine Content
- Articles and features
- Content management system
- Rich text editing

### Playlists
- Curated music playlists
- Playlist creation and sharing
- Music integration

## 🔒 Security

- JWT authentication
- Protected API routes
- Input validation
- XSS protection
- CSRF protection

## 🧪 Testing

Testing setup coming soon with:
- Jest for unit tests
- React Testing Library
- Cypress for E2E tests

## 📈 Performance

- Code splitting with Vite
- Lazy loading of routes
- Optimized images
- Caching strategies
- Bundle analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ for the Stratford Music Community 