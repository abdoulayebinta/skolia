from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ResourceResponse(BaseModel):
    """Response schema for a single resource"""
    id: str
    title: str
    description: str
    type: str
    audience: str
    duration: str
    subject: str
    grade: int
    tags: List[str]
    thumbnail: Optional[str] = None
    content_url: Optional[str] = None
    alignment_score: Optional[int] = None
    cultural_relevance: Optional[bool] = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "sci-001",
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
                "created_at": "2026-01-31T12:00:00Z"
            }
        }


class ResourceListResponse(BaseModel):
    """Response schema for a list of resources with pagination"""
    resources: List[ResourceResponse]
    total: int
    page: int = 1
    limit: int = 50
    has_more: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "resources": [
                    {
                        "id": "sci-001",
                        "title": "The Magic of Photosynthesis",
                        "description": "An animated video explaining how plants convert sunlight into energy.",
                        "type": "video",
                        "audience": "Student",
                        "duration": "4:30",
                        "subject": "Science",
                        "grade": 5,
                        "tags": ["plants", "biology", "energy", "sun"],
                        "alignment_score": 98,
                        "cultural_relevance": False
                    }
                ],
                "total": 1,
                "page": 1,
                "limit": 50,
                "has_more": False
            }
        }