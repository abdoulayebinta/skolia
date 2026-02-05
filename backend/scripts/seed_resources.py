"""
Seed script to populate the database with mock resources.
Run from project root: python -m backend.scripts.seed_resources
"""
import asyncio
import sys
from pathlib import Path
from datetime import datetime

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from motor.motor_asyncio import AsyncIOMotorClient
from backend.config import settings


# Expanded mock resources based on frontend mockData.ts
MOCK_RESOURCES = [
    # TEACHER TOOLS
    {
        "_id": "tch-001",
        "title": "Thematic File: Ecosystems & Interactions",
        "description": "A comprehensive guide for teaching ecosystems, including misconceptions, key vocabulary, and assessment rubrics.",
        "type": "thematic_file",
        "audience": "Teacher",
        "duration": "15 pages",
        "subject": "Science",
        "grade": 5,
        "tags": ["guide", "pedagogy", "ecosystems"],
        "alignment_score": 100,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "tch-002",
        "title": "Sequence Guide: Indigenous Storytelling",
        "description": "Pedagogical framework for introducing oral traditions respectfully in the classroom.",
        "type": "sequence",
        "audience": "Teacher",
        "duration": "8 pages",
        "subject": "English",
        "grade": 5,
        "tags": ["guide", "indigenous", "storytelling"],
        "alignment_score": 100,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "tch-003",
        "title": "Guide Pédagogique: La Francophonie",
        "description": "Strategies for teaching French culture and dialects to immersion students.",
        "type": "guide",
        "audience": "Teacher",
        "duration": "12 pages",
        "subject": "French",
        "grade": 5,
        "tags": ["guide", "francophonie", "culture"],
        "alignment_score": 100,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # SCIENCE - PHOTOSYNTHESIS / PLANTS
    {
        "_id": "sci-001",
        "title": "The Magic of Photosynthesis",
        "description": "An animated video explaining how plants convert sunlight into energy.",
        "type": "video",
        "audience": "Student",
        "duration": "4:30",
        "subject": "Science",
        "grade": 5,
        "tags": ["plants", "biology", "energy", "sun"],
        "alignment_score": 98,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "sci-002",
        "title": "Plant Cell Structures",
        "description": "Interactive diagram showing the parts of a plant cell.",
        "type": "article",
        "audience": "Student",
        "duration": "10 min",
        "subject": "Science",
        "grade": 5,
        "tags": ["cells", "biology", "plants"],
        "alignment_score": 95,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "sci-003",
        "title": "Grow Your Own Garden",
        "description": "A simulation game where students manage water and sunlight for plants.",
        "type": "game",
        "audience": "Student",
        "duration": "15 min",
        "subject": "Science",
        "grade": 5,
        "tags": ["plants", "simulation", "ecology"],
        "alignment_score": 92,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "sci-004",
        "title": "Indigenous Plant Medicine",
        "description": "Exploring how local indigenous communities use plants for healing.",
        "type": "video",
        "audience": "Student",
        "duration": "8:00",
        "subject": "Science",
        "grade": 5,
        "tags": ["plants", "culture", "indigenous", "health"],
        "alignment_score": 99,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # SCIENCE - SPACE
    {
        "_id": "sci-005",
        "title": "Journey to Mars",
        "description": "A documentary clip about the Mars rover missions.",
        "type": "video",
        "audience": "Student",
        "duration": "6:15",
        "subject": "Science",
        "grade": 5,
        "tags": ["space", "planets", "mars", "technology"],
        "alignment_score": 94,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "sci-006",
        "title": "Solar System Builder",
        "description": "Drag and drop planets to create a solar system.",
        "type": "game",
        "audience": "Student",
        "duration": "20 min",
        "subject": "Science",
        "grade": 5,
        "tags": ["space", "planets", "gravity"],
        "alignment_score": 90,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # SCIENCE - ADDITIONAL TOPICS
    {
        "_id": "sci-007",
        "title": "Water Cycle Explained",
        "description": "Interactive animation showing evaporation, condensation, and precipitation.",
        "type": "video",
        "audience": "Student",
        "duration": "5:30",
        "subject": "Science",
        "grade": 4,
        "tags": ["water", "weather", "cycle", "environment"],
        "alignment_score": 96,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "sci-008",
        "title": "Forces and Motion Lab",
        "description": "Virtual lab experiments with friction, gravity, and momentum.",
        "type": "game",
        "audience": "Student",
        "duration": "25 min",
        "subject": "Science",
        "grade": 6,
        "tags": ["physics", "forces", "motion", "experiments"],
        "alignment_score": 93,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # ENGLISH - STORYTELLING / GRAMMAR
    {
        "_id": "eng-001",
        "title": "The Hero's Journey",
        "description": "Understanding the structure of epic myths and stories.",
        "type": "video",
        "audience": "Student",
        "duration": "5:00",
        "subject": "English",
        "grade": 5,
        "tags": ["writing", "story", "mythology"],
        "alignment_score": 96,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "eng-002",
        "title": "Creative Writing Prompts",
        "description": "A collection of image-based prompts to spark story ideas.",
        "type": "worksheet",
        "audience": "Student",
        "duration": "30 min",
        "subject": "English",
        "grade": 5,
        "tags": ["writing", "creativity"],
        "alignment_score": 88,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "eng-003",
        "title": "Voices of the Land",
        "description": "Short stories from diverse Canadian authors about nature.",
        "type": "book",
        "audience": "Student",
        "duration": "15 pages",
        "subject": "English",
        "grade": 5,
        "tags": ["reading", "culture", "nature"],
        "alignment_score": 97,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "eng-004",
        "title": "Poetry Workshop: Haiku",
        "description": "Learn to write haiku poems with examples from nature.",
        "type": "article",
        "audience": "Student",
        "duration": "12 min",
        "subject": "English",
        "grade": 4,
        "tags": ["poetry", "writing", "nature"],
        "alignment_score": 91,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # FRENCH - VOCABULARY / CULTURE
    {
        "_id": "fr-001",
        "title": "Les Saisons (The Seasons)",
        "description": "Learn vocabulary related to the four seasons in French.",
        "type": "video",
        "audience": "Student",
        "duration": "3:45",
        "subject": "French",
        "grade": 5,
        "tags": ["vocabulary", "seasons", "nature"],
        "alignment_score": 93,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "fr-002",
        "title": "Cuisine Française",
        "description": "Read about traditional French dishes and ingredients.",
        "type": "article",
        "audience": "Student",
        "duration": "8 min",
        "subject": "French",
        "grade": 5,
        "tags": ["culture", "food", "reading"],
        "alignment_score": 91,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "fr-003",
        "title": "Verb Conjugation Challenge",
        "description": "A fast-paced game to practice -ER verbs.",
        "type": "game",
        "audience": "Student",
        "duration": "10 min",
        "subject": "French",
        "grade": 5,
        "tags": ["grammar", "verbs", "practice"],
        "alignment_score": 89,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "fr-004",
        "title": "Contes Acadiens",
        "description": "Traditional Acadian folktales told by a local storyteller.",
        "type": "podcast",
        "audience": "Student",
        "duration": "12:00",
        "subject": "French",
        "grade": 5,
        "tags": ["culture", "storytelling", "acadian", "listening"],
        "alignment_score": 98,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # MATH RESOURCES
    {
        "_id": "math-001",
        "title": "Fractions Made Easy",
        "description": "Visual guide to understanding fractions with pizza slices.",
        "type": "video",
        "audience": "Student",
        "duration": "6:00",
        "subject": "Math",
        "grade": 4,
        "tags": ["fractions", "numbers", "visual"],
        "alignment_score": 95,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "math-002",
        "title": "Geometry Explorer",
        "description": "Interactive tool to explore shapes, angles, and symmetry.",
        "type": "game",
        "audience": "Student",
        "duration": "20 min",
        "subject": "Math",
        "grade": 5,
        "tags": ["geometry", "shapes", "angles"],
        "alignment_score": 92,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "math-003",
        "title": "Word Problems Workshop",
        "description": "Practice solving real-world math problems step by step.",
        "type": "worksheet",
        "audience": "Student",
        "duration": "25 min",
        "subject": "Math",
        "grade": 5,
        "tags": ["problem-solving", "word-problems", "practice"],
        "alignment_score": 90,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    
    # HISTORY RESOURCES
    {
        "_id": "hist-001",
        "title": "Ancient Civilizations",
        "description": "Explore the cultures of ancient Egypt, Greece, and Rome.",
        "type": "video",
        "audience": "Student",
        "duration": "10:00",
        "subject": "History",
        "grade": 6,
        "tags": ["ancient", "civilizations", "culture"],
        "alignment_score": 94,
        "cultural_relevance": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "hist-002",
        "title": "Canadian Confederation",
        "description": "Interactive timeline of events leading to Canadian Confederation.",
        "type": "article",
        "audience": "Student",
        "duration": "15 min",
        "subject": "History",
        "grade": 7,
        "tags": ["canada", "confederation", "timeline"],
        "alignment_score": 97,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    {
        "_id": "hist-003",
        "title": "Indigenous Peoples of Canada",
        "description": "Learn about the diverse First Nations, Métis, and Inuit cultures.",
        "type": "video",
        "audience": "Student",
        "duration": "12:00",
        "subject": "History",
        "grade": 6,
        "tags": ["indigenous", "canada", "culture", "first-nations"],
        "alignment_score": 99,
        "cultural_relevance": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
]


async def seed_resources():
    """Seed the database with mock resources."""
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client.get_database()
    
    try:
        # Test connection
        await client.admin.command('ping')
        print("✓ Connected to MongoDB Atlas")
        
        # Get resources collection
        resources_collection = database.resources
        
        # Clear existing resources
        result = await resources_collection.delete_many({})
        print(f"✓ Cleared {result.deleted_count} existing resources")
        
        # Insert new resources
        result = await resources_collection.insert_many(MOCK_RESOURCES)
        print(f"✓ Inserted {len(result.inserted_ids)} resources")
        
        # Verify insertion
        count = await resources_collection.count_documents({})
        print(f"✓ Total resources in database: {count}")
        
        # Create indexes for better query performance
        await resources_collection.create_index("subject")
        await resources_collection.create_index("grade")
        await resources_collection.create_index("type")
        await resources_collection.create_index("audience")
        await resources_collection.create_index("tags")
        print("✓ Created indexes for optimized queries")
        
        print("\n✅ Seeding completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        raise
    finally:
        client.close()
        print("✓ Closed MongoDB connection")


if __name__ == "__main__":
    asyncio.run(seed_resources())