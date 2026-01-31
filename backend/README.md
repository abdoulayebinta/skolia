# IDÉLLIA Backend Setup

## Prerequisites

- Python 3.13+ installed
- MongoDB Atlas account with connection URI

## Installation

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB Atlas connection string
   - Update `JWT_SECRET` with a secure random string (min 32 characters)

## Running the Backend

Start the development server:
```bash
uvicorn backend.main:app --reload --port 8000
```

The API will be available at:
- Main API: http://localhost:8000
- Health Check: http://localhost:8000/healthz
- API Documentation: http://localhost:8000/docs

## Testing the Setup

1. Visit http://localhost:8000/healthz in your browser
2. You should see:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "timestamp": "2026-01-31T18:00:00Z"
   }
   ```

## Project Structure

```
backend/
├── main.py           # FastAPI application entry point
├── config.py         # Configuration management
├── database.py       # MongoDB connection setup
├── requirements.txt  # Python dependencies
├── .env             # Environment variables (not in git)
└── .env.example     # Environment variables template
```

## Next Steps

After confirming the backend is running:
1. Install Python 3.13+ if not already installed
2. Create and activate a virtual environment
3. Install dependencies with `pip install -r requirements.txt`
4. Start the backend with `uvicorn backend.main:app --reload --port 8000`
5. Verify the health endpoint returns "connected" status
6. Start the frontend and test connectivity