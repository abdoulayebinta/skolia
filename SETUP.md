# Setup Guide - Frontend & Backend Communication

This guide explains how to set up and run both the frontend and backend to enable full communication between them.

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- MongoDB Atlas account (or local MongoDB instance)

## Backend Setup

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create Python virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

The backend already has a `.env` file. Ensure it contains:

```env
APP_ENV=development
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/idellia?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-min-32-characters-long-change-this-in-production
JWT_EXPIRES_IN=86400
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Important:** Update `MONGODB_URI` with your actual MongoDB connection string.

### 5. Run the backend server

```bash
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

## Frontend Setup

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment configuration

A `.env.local` file has been created with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

This tells the frontend where to find the backend API.

### 4. Run the development server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Communication

The frontend now includes an API utility file at `frontend/lib/api.ts` that provides:

### Educator API

- `educatorAPI.register()` - Register new educator
- `educatorAPI.login()` - Login educator
- `educatorAPI.getProfile()` - Get educator profile

### Journey API

- `journeyAPI.create()` - Create new learning journey
- `journeyAPI.getAll()` - Get all journeys
- `journeyAPI.getById()` - Get journey by ID
- `journeyAPI.getByCode()` - Get journey by student code
- `journeyAPI.updateProgress()` - Update journey progress
- `journeyAPI.delete()` - Delete journey

### Resource API

- `resourceAPI.search()` - Search resources
- `resourceAPI.getById()` - Get resource by ID

## Usage Example

```typescript
import { journeyAPI } from '@/lib/api';

// In your component
const fetchJourneys = async () => {
  try {
    const token = 'your-jwt-token';
    const journeys = await journeyAPI.getAll(token);
    console.log(journeys);
  } catch (error) {
    console.error('Failed to fetch journeys:', error);
  }
};
```

## Running Both Servers

### Option 1: Two Terminal Windows

1. Terminal 1: Run backend

   ```bash
   cd backend
   source venv/bin/activate
   uvicorn main:app --reload --port 8000
   ```

2. Terminal 2: Run frontend
   ```bash
   cd frontend
   npm run dev
   ```

### Option 2: Using tmux or screen

```bash
# Start backend in background
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000 &

# Start frontend
cd frontend && npm run dev
```

## Verifying Communication

1. Open browser to `http://localhost:3000`
2. Open browser console (F12)
3. Check Network tab for API calls to `http://localhost:8000`
4. Backend logs should show incoming requests

## Troubleshooting

### CORS Issues

If you see CORS errors, ensure:

- Backend `.env` has `CORS_ORIGINS=http://localhost:3000`
- Backend server is running on port 8000
- Frontend is accessing the correct API URL

### Connection Refused

- Verify backend is running: `curl http://localhost:8000/docs`
- Check if port 8000 is available: `lsof -i :8000`

### Environment Variables Not Loading

- Restart the development server after changing `.env.local`
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access

## Production Deployment

For production, update:

- `frontend/.env.local` → `NEXT_PUBLIC_API_URL=https://your-api-domain.com`
- `backend/.env` → Update `CORS_ORIGINS` to include production frontend URL
- Use proper JWT secrets and secure MongoDB credentials
