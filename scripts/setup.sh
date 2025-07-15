#!/bin/bash

# Stratford Music Platform Setup Script
# This script sets up the development environment for the monorepo

set -e

echo "🎵 Setting up Stratford Music Platform..."
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Create environment files if they don't exist
echo "🔧 Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << EOF
DATABASE_URL="postgresql://postgres:password@localhost:5432/stratford_music"
JWT_SECRET="your-super-secret-jwt-key-dev"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
EOF
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creating frontend/.env..."
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
EOF
fi

if [ ! -f "mobile/.env" ]; then
    echo "Creating mobile/.env..."
    cat > mobile/.env << EOF
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_ENVIRONMENT=development
EOF
fi

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
    echo "🐳 You can start the database with: docker-compose up postgres redis"
else
    echo "⚠️  Docker is not installed. You'll need to install PostgreSQL manually."
fi

# Check if PostgreSQL is running locally
if command -v psql &> /dev/null; then
    if pg_isready -q; then
        echo "✅ PostgreSQL is running"
    else
        echo "⚠️  PostgreSQL is not running. Start it with: brew services start postgresql"
    fi
else
    echo "⚠️  PostgreSQL client not found. Install with: brew install postgresql"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Install workspace dependencies: npm run install:all"
echo "2. Set up the database: npm run db:setup"
echo "3. Seed the database: npm run db:seed"
echo "4. Start development: npm run dev"
echo ""
echo "Or use Docker:"
echo "1. Start services: docker-compose up -d"
echo "2. Install dependencies: npm run install:all"
echo "3. Set up database: npm run db:setup"
echo "4. Start development: npm run dev"
echo ""
echo "Happy coding! 🎵" 