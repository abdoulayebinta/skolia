from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class Educator(BaseModel):
    """
    Educator model representing an authenticated educator user.
    """
    id: Optional[str] = None
    email: EmailStr
    password_hash: str
    name: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "edu_123456",
                "email": "educator@example.com",
                "name": "John Doe",
                "created_at": "2026-01-31T12:00:00Z",
                "updated_at": "2026-01-31T12:00:00Z"
            }
        }