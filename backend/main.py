from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import logging

from backend.config import settings
from backend.database import connect_to_mongo, close_mongo_connection, ping_database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    logger.info("Starting up application...")
    await connect_to_mongo()
    yield
    # Shutdown
    logger.info("Shutting down application...")
    await close_mongo_connection()


# Initialize FastAPI app
app = FastAPI(
    title="IDÉLLIA Learning Journey Platform API",
    description="Backend API for the IDÉLLIA learning journey platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def health_check():
    """
    Health check endpoint to verify backend and database connectivity.
    
    Returns:
        dict: Status information including database connection status
    """
    db_status = "connected" if await ping_database() else "disconnected"
    
    return {
        "status": "ok",
        "database": db_status,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "IDÉLLIA Learning Journey Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }