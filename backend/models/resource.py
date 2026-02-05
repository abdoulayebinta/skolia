from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class Resource(BaseModel):
    """
    Resource model representing an educational resource in the library.
    """
    id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)
    type: str = Field(..., description="Resource type: video, article, game, book, podcast, worksheet, guide, sequence, thematic_file")
    audience: str = Field(..., description="Target audience: Student, Teacher")
    duration: str = Field(..., description="Duration or length (e.g., '5 min', '10 pages')")
    subject: str = Field(..., description="Subject area: Science, Math, English, French, History")
    grade: int = Field(..., ge=1, le=12, description="Grade level (1-12)")
    tags: List[str] = Field(default_factory=list, description="Searchable tags")
    thumbnail: Optional[str] = Field(None, description="URL to thumbnail image")
    content_url: Optional[str] = Field(None, description="URL to the actual content")
    alignment_score: Optional[int] = Field(None, ge=0, le=100, description="Curriculum alignment score (0-100)")
    cultural_relevance: Optional[bool] = Field(False, description="Whether resource has cultural relevance")
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