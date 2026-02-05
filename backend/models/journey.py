"""
Journey models for learning journey generation.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class JourneyStepModel(BaseModel):
    """Journey step model representing a single step in a learning journey."""
    step_type: str = Field(..., description="Step type: Preparation, Hook, Instruction, Application")
    resource_id: str = Field(..., description="ID of the resource for this step")
    
    class Config:
        from_attributes = True


class JourneyModel(BaseModel):
    """Journey model representing a complete learning journey."""
    id: Optional[str] = None  # Temp ID for frontend compatibility (e.g., journey-{timestamp})
    title: str = Field(..., min_length=1, max_length=200)
    subject: str = Field(..., description="Subject area: Science, Math, English, French, History")
    grade: int = Field(..., ge=1, le=12, description="Grade level (1-12)")
    prompt: str = Field(..., description="Original educator prompt")
    steps: List[JourneyStepModel] = Field(default_factory=list, description="Journey steps")
    educator_id: Optional[str] = None
    created_at: Optional[datetime] = None
    class_code: Optional[str] = None  # For sharing with students
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "journey-1738354800000",
                "title": "Learning Journey: Grade 5 Science lesson about plants",
                "subject": "Science",
                "grade": 5,
                "prompt": "Grade 5 Science lesson about plants and photosynthesis",
                "steps": [
                    {
                        "step_type": "Preparation",
                        "resource_id": "tch-001"
                    },
                    {
                        "step_type": "Hook",
                        "resource_id": "sci-001"
                    },
                    {
                        "step_type": "Instruction",
                        "resource_id": "sci-002"
                    },
                    {
                        "step_type": "Application",
                        "resource_id": "sci-003"
                    }
                ],
                "created_at": "2026-01-31T12:00:00Z"
            }
        }