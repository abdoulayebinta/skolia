from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from backend.config import settings
import logging

logger = logging.getLogger(__name__)

# Global MongoDB client
client: AsyncIOMotorClient = None
database = None


async def connect_to_mongo():
    """Initialize MongoDB connection."""
    global client, database
    try:
        client = AsyncIOMotorClient(settings.mongodb_uri)
        database = client.get_database()
        # Test the connection
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas")
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        logger.info("Closed MongoDB connection")


async def ping_database() -> bool:
    """Ping the database to check connection status."""
    try:
        await client.admin.command('ping')
        return True
    except Exception as e:
        logger.error(f"Database ping failed: {e}")
        return False


def get_database():
    """Get the database instance."""
    return database