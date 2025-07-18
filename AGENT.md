# Stratford Music Platform - Agent Guide

## Build/Lint/Test Commands

- `npm run dev` - Start all development servers (backend:3001, frontend:3000)
- `npm run build` - Build all projects for production
- `npm run test` - Run all tests (backend uses Jest, frontend uses Vite)
- `npm run lint` - Run ESLint on all packages
- `npm run test:backend` - Run backend tests only
- `npm run test:frontend` - Run frontend tests only
- `npm run lint:backend` - Run backend ESLint only
- `npm run lint:frontend` - Run frontend ESLint only
- `cd backend && npm test` - Run single backend test
- `cd frontend && npm test` - Run single frontend test

## Architecture

- **Monorepo**: Uses npm workspaces with 4 packages (backend, frontend, mobile, shared)
- **Backend**: Express.js + TypeScript + Prisma + PostgreSQL (port 3001)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS (port 3000)
- **Mobile**: React Native + Expo (mobile directory exists but no package.json)
- **Shared**: Common TypeScript types and utilities
- **Database**: PostgreSQL with Prisma ORM (`npm run db:setup`, `npm run db:seed`)

## Code Style Guidelines

- **TypeScript**: Strict mode enabled in backend/shared, relaxed in frontend
- **Backend**: CommonJS modules, ES2020 target, strict null checks
- **Frontend**: ES modules, React JSX, path mapping with `@/*` for src
- **Imports**: Use absolute imports in frontend (`@/components/...`)
- **Linting**: ESLint with React plugins for frontend, basic TypeScript rules for backend
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Database**: Use Prisma schema, run migrations with `npm run db:migrate`
