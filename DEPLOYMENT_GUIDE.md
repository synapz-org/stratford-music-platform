# 🚀 Deployment Guide - Stratford Music Platform

This guide will help you deploy the backend API and database for the Stratford Music Platform.

## 📋 Prerequisites

- GitHub account (already set up)
- Node.js 18+ installed locally
- Git installed locally

## 🗄️ Database Setup

### Option 1: Neon (Recommended - Free PostgreSQL)

1. **Sign up at [neon.tech](https://neon.tech)**
2. **Create a new project:**
   - Project name: `stratford-music`
   - Region: Choose closest to your users
3. **Get your connection string:**
   - Go to your project dashboard
   - Click "Connection Details"
   - Copy the connection string (looks like: `postgresql://user:password@host:port/database`)

### Option 2: Railway (All-in-one solution)

1. **Sign up at [railway.app](https://railway.app)**
2. **Create a new project**
3. **Add PostgreSQL service:**
   - Click "New Service" → "Database" → "PostgreSQL"
   - Railway will provide the connection string automatically

## 🚀 Backend Deployment

### Option 1: Railway (Recommended)

1. **Connect your GitHub repo:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `stratford-music-app` repository
   - Set root directory to `backend`

2. **Configure environment variables:**
   ```bash
   DATABASE_URL=your_neon_or_railway_postgres_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=production
   PORT=3001
   CORS_ORIGIN=https://stratford-music-platform-frontend.vercel.app
   ```

3. **Deploy:**
   - Railway will automatically build and deploy your backend
   - The API will be available at: `https://your-app-name.railway.app`

### Option 2: Render

1. **Sign up at [render.com](https://render.com)**
2. **Create a new Web Service:**
   - Connect your GitHub repo
   - Set root directory to `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

3. **Configure environment variables** (same as above)

### Option 3: Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app:**
   ```bash
   heroku create stratford-music-api
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your_super_secret_jwt_key_here
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://stratford-music-platform-frontend.vercel.app
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

## 🔧 Database Setup Commands

Once your database is connected, run these commands locally to set up the database:

```bash
cd backend

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with sample data
npm run db:seed
```

## 🔗 Connect Frontend to Backend

1. **Update frontend environment:**
   - Go to your Vercel dashboard
   - Navigate to your frontend project
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url.com`

2. **Update API calls in frontend:**
   - The frontend is already configured to use `VITE_API_URL`
   - Once you set this environment variable, it will connect to your real backend

## 🧪 Testing Your Deployment

1. **Health check:**
   ```
   GET https://your-backend-url.com/api/health
   ```

2. **Test authentication:**
   ```
   POST https://your-backend-url.com/api/auth/register
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123",
     "firstName": "Test",
     "lastName": "User"
   }
   ```

3. **Test events endpoint:**
   ```
   GET https://your-backend-url.com/api/events
   ```

## 🔒 Security Checklist

- [ ] JWT_SECRET is set to a strong, random string
- [ ] CORS_ORIGIN is set to your frontend URL
- [ ] NODE_ENV is set to production
- [ ] Database connection uses SSL
- [ ] Rate limiting is enabled (already configured)
- [ ] Helmet security headers are enabled (already configured)

## 📊 Monitoring

- **Railway:** Built-in monitoring and logs
- **Render:** Built-in monitoring and logs
- **Heroku:** Use `heroku logs --tail` for real-time logs

## 🆘 Troubleshooting

### Common Issues:

1. **Database connection errors:**
   - Check DATABASE_URL format
   - Ensure database is accessible from your deployment platform
   - Verify SSL settings

2. **Build failures:**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

3. **CORS errors:**
   - Verify CORS_ORIGIN matches your frontend URL exactly
   - Check for trailing slashes

4. **JWT errors:**
   - Ensure JWT_SECRET is set
   - Verify JWT_SECRET is consistent across deployments

## 📞 Support

If you encounter issues:
1. Check the deployment platform logs
2. Verify environment variables are set correctly
3. Test database connection locally first
4. Check the health endpoint for basic connectivity

---

**Next Steps:** Once your backend is deployed and connected, you can:
1. Test the full application flow
2. Set up the mobile app
3. Add payment processing
4. Implement the CMS 