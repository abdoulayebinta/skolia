"""
Journey schemas for API requests and responses.
"""
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from schemas.resource import ResourceResponse


class GenerateJourneyRequest(BaseModel):
    """Request schema for generating a journey from a prompt."""
    prompt: str = Field(..., min_length=1, max_length=500, description="Educator's lesson description")
    
    class Config:
        json_schema_extra = {
            "example": {
                "prompt": "Grade 5 Science lesson about plants and photosynthesis"
            }
        }


class JourneyStepRequest(BaseModel):
    """Request schema for a journey step (for creating/updating journeys)."""
    step_type: str = Field(..., description="Step type: Preparation, Hook, Instruction, Application")
    resource_id: str = Field(..., description="Resource ID for this step")
    
    class Config:
        from_attributes = True


class CreateJourneyRequest(BaseModel):
    """Request schema for creating a new journey."""
    title: str = Field(..., min_length=1, max_length=200)
    subject: str = Field(..., description="Subject area")
    grade: int = Field(..., ge=1, le=12)
    prompt: str = Field(..., description="Original educator prompt")
    steps: List[JourneyStepRequest] = Field(..., description="Journey steps")
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Learning Journey: Grade 5 Science lesson about plants",
                "subject": "Science",
                "grade": 5,
                "prompt": "Grade 5 Science lesson about plants and photosynthesis",
                "steps": [
                    {"step_type": "Preparation", "resource_id": "tch-001"},
                    {"step_type": "Hook", "resource_id": "sci-001"},
                    {"step_type": "Instruction", "resource_id": "sci-002"},
                    {"step_type": "Application", "resource_id": "sci-003"}
                ]
            }
        }


class UpdateJourneyRequest(BaseModel):
    """Request schema for updating an existing journey."""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    steps: Optional[List[JourneyStepRequest]] = Field(None, description="Updated journey steps")
    
    class Config:
        json_schema_extra = {
            "example": {
                "steps": [
                    {"step_type": "Preparation", "resource_id": "tch-001"},
                    {"step_type": "Hook", "resource_id": "sci-004"},
                    {"step_type": "Instruction", "resource_id": "sci-002"},
                    {"step_type": "Application", "resource_id": "sci-003"}
                ]
            }
        }


class JourneyStepResponse(BaseModel):
    """Response schema for a single journey step with full resource details."""
    step_type: str = Field(..., description="Step type: Preparation, Hook, Instruction, Application")
    resource: ResourceResponse = Field(..., description="Full resource details for this step")
    
    class Config:
        from_attributes = True


class JourneyResponse(BaseModel):
    """Response schema for a complete journey with all details."""
    id: str = Field(..., description="Journey ID (e.g., journey-{timestamp})")
    title: str
    grade: int
    subject: str
    steps: List[JourneyStepResponse]
    created_at: str = Field(..., description="ISO 8601 timestamp")
    class_code: Optional[str] = None
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "journey-1738354800000",
                "title": "Learning Journey: Grade 5 Science lesson about plants",
                "grade": 5,
                "subject": "Science",
                "steps": [
                    {
                        "step_type": "Preparation",
                        "resource": {
                            "id": "tch-001",
                            "title": "Thematic File: Ecosystems & Interactions",
                            "description": "A comprehensive guide for teaching ecosystems",
                            "type": "thematic_file",
                            "audience": "Teacher",
                            "duration": "15 pages",
                            "subject": "Science",
                            "grade": 5,
                            "tags": ["guide", "pedagogy", "ecosystems"],
                            "alignment_score": 100,
                            "cultural_relevance": False
                        }
                    }
                ],
                "created_at": "2026-01-31T12:00:00Z"
            }
        }