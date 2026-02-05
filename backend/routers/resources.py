from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional, List
import re
from database import get_database
from schemas.resource import ResourceResponse, ResourceListResponse


router = APIRouter(tags=["Resources"])


@router.get("/", response_model=ResourceListResponse)
async def list_resources(
    subject: Optional[str] = Query(None, description="Filter by subject (Science, Math, English, French, History)"),
    grade: Optional[int] = Query(None, ge=1, le=12, description="Filter by grade level (1-12)"),
    type: Optional[str] = Query(None, description="Filter by resource type (video, article, game, etc.)"),
    audience: Optional[str] = Query(None, description="Filter by audience (Student, Teacher)"),
    cultural_relevance: Optional[bool] = Query(None, description="Filter by cultural relevance"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page")
) -> ResourceListResponse:
    """
    List resources with optional filtering and pagination.
    
    Args:
        subject: Filter by subject area
        grade: Filter by grade level
        type: Filter by resource type
        audience: Filter by target audience
        cultural_relevance: Filter by cultural relevance
        page: Page number for pagination
        limit: Number of items per page
        
    Returns:
        ResourceListResponse with filtered resources and pagination info
    """
    db = get_database()
    
    # Build filter query
    filter_query = {}
    
    if subject:
        filter_query["subject"] = subject
    
    if grade is not None:
        filter_query["grade"] = grade
    
    if type:
        filter_query["type"] = type
    
    if audience:
        filter_query["audience"] = audience
    
    if cultural_relevance is not None:
        filter_query["cultural_relevance"] = cultural_relevance
    
    # Calculate skip for pagination
    skip = (page - 1) * limit
    
    # Get total count
    total = await db.resources.count_documents(filter_query)
    
    # Get resources with pagination
    cursor = db.resources.find(filter_query).skip(skip).limit(limit)
    resources_data = await cursor.to_list(length=limit)
    
    # Convert to response models
    resources = []
    for resource_data in resources_data:
        resources.append(ResourceResponse(
            id=resource_data["_id"],
            title=resource_data["title"],
            description=resource_data["description"],
            type=resource_data["type"],
            audience=resource_data["audience"],
            duration=resource_data["duration"],
            subject=resource_data["subject"],
            grade=resource_data["grade"],
            tags=resource_data.get("tags", []),
            thumbnail=resource_data.get("thumbnail"),
            content_url=resource_data.get("content_url"),
            alignment_score=resource_data.get("alignment_score"),
            cultural_relevance=resource_data.get("cultural_relevance", False),
            created_at=resource_data.get("created_at"),
            updated_at=resource_data.get("updated_at")
        ))
    
    # Check if there are more pages
    has_more = (skip + limit) < total
    
    return ResourceListResponse(
        resources=resources,
        total=total,
        page=page,
        limit=limit,
        has_more=has_more
    )


@router.get("/search", response_model=ResourceListResponse)
async def search_resources(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=100, description="Items per page")
) -> ResourceListResponse:
    """
    Search resources by query string.
    
    Searches across title, description, and tags using case-insensitive regex.
    
    Args:
        q: Search query string
        page: Page number for pagination
        limit: Number of items per page
        
    Returns:
        ResourceListResponse with matching resources and pagination info
    """
    db = get_database()
    
    # Create case-insensitive regex pattern
    search_pattern = re.compile(re.escape(q), re.IGNORECASE)
    
    # Build search query - search in title, description, and tags
    search_query = {
        "$or": [
            {"title": {"$regex": search_pattern}},
            {"description": {"$regex": search_pattern}},
            {"tags": {"$regex": search_pattern}}
        ]
    }
    
    # Calculate skip for pagination
    skip = (page - 1) * limit
    
    # Get total count
    total = await db.resources.count_documents(search_query)
    
    # Get resources with pagination
    cursor = db.resources.find(search_query).skip(skip).limit(limit)
    resources_data = await cursor.to_list(length=limit)
    
    # Convert to response models
    resources = []
    for resource_data in resources_data:
        resources.append(ResourceResponse(
            id=resource_data["_id"],
            title=resource_data["title"],
            description=resource_data["description"],
            type=resource_data["type"],
            audience=resource_data["audience"],
            duration=resource_data["duration"],
            subject=resource_data["subject"],
            grade=resource_data["grade"],
            tags=resource_data.get("tags", []),
            thumbnail=resource_data.get("thumbnail"),
            content_url=resource_data.get("content_url"),
            alignment_score=resource_data.get("alignment_score"),
            cultural_relevance=resource_data.get("cultural_relevance", False),
            created_at=resource_data.get("created_at"),
            updated_at=resource_data.get("updated_at")
        ))
    
    # Check if there are more pages
    has_more = (skip + limit) < total
    
    return ResourceListResponse(
        resources=resources,
        total=total,
        page=page,
        limit=limit,
        has_more=has_more
    )


@router.get("/{id}", response_model=ResourceResponse)
async def get_resource(id: str) -> ResourceResponse:
    """
    Get a specific resource by ID.
    
    Args:
        id: Resource ID
        
    Returns:
        ResourceResponse with resource data
        
    Raises:
        HTTPException: If resource not found
    """
    db = get_database()
    
    # Find resource by ID
    resource_data = await db.resources.find_one({"_id": id})
    
    if not resource_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Resource with id '{id}' not found"
        )
    
    # Convert to response model
    return ResourceResponse(
        id=resource_data["_id"],
        title=resource_data["title"],
        description=resource_data["description"],
        type=resource_data["type"],
        audience=resource_data["audience"],
        duration=resource_data["duration"],
        subject=resource_data["subject"],
        grade=resource_data["grade"],
        tags=resource_data.get("tags", []),
        thumbnail=resource_data.get("thumbnail"),
        content_url=resource_data.get("content_url"),
        alignment_score=resource_data.get("alignment_score"),
        cultural_relevance=resource_data.get("cultural_relevance", False),
        created_at=resource_data.get("created_at"),
        updated_at=resource_data.get("updated_at")
    )