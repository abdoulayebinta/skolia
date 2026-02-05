from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class SignupRequest(BaseModel):
    """Request schema for educator signup"""
    email: EmailStr = Field(..., description="Educator's email address")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    name: str = Field(..., min_length=2, description="Educator's full name")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "educator@example.com",
                "password": "securepassword123",
                "name": "John Doe"
            }
        }


class LoginRequest(BaseModel):
    """Request schema for educator login"""
    email: EmailStr = Field(..., description="Educator's email address")
    password: str = Field(..., description="Password")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "educator@example.com",
                "password": "securepassword123"
            }
        }


class EducatorResponse(BaseModel):
    """Response schema for educator data (without password)"""
    id: str
    email: EmailStr
    name: str
    created_at: datetime
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


class Token(BaseModel):
    """Response schema for authentication token"""
    access_token: str
    token_type: str = "bearer"
    educator: EducatorResponse

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "educator": {
                    "id": "edu_123456",
                    "email": "educator@example.com",
                    "name": "John Doe",
                    "created_at": "2026-01-31T12:00:00Z"
                }
            }
        }