"""
Journey generation router for creating learning journeys from prompts.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
import random
import string
from database import get_database
from schemas.journey import (
    GenerateJourneyRequest,
    JourneyResponse,
    JourneyStepResponse,
    CreateJourneyRequest,
    UpdateJourneyRequest
)
from schemas.resource import ResourceResponse
from schemas.educator import EducatorResponse
from dependencies.auth import get_current_educator
from services.journey_generator import analyze_prompt, score_resources, construct_journey
from models.resource import Resource


router = APIRouter(tags=["Journeys"])


@router.post("/generate", response_model=JourneyResponse)
async def generate_journey(
    request: GenerateJourneyRequest,
    current_educator: EducatorResponse = Depends(get_current_educator)
) -> JourneyResponse:
    """
    Generate a structured learning journey from an educator's text prompt.
    
    This endpoint:
    1. Analyzes the prompt to extract subject, grade, and keywords
    2. Queries the database for relevant resources
    3. Scores resources based on keyword matching and cultural relevance
    4. Constructs a 4-step journey (Preparation, Hook, Instruction, Application)
    5. Returns the journey as a draft (not saved to DB)
    
    Args:
        request: GenerateJourneyRequest with the educator's prompt
        current_educator: Current authenticated educator (from JWT)
        
    Returns:
        JourneyResponse with the generated journey structure
        
    Raises:
        HTTPException: If insufficient resources are found
    """
    db = get_database()
    
    # Step 1: Analyze the prompt
    subject, grade, keywords = analyze_prompt(request.prompt)
    
    # Step 2: Query database for resources matching subject and grade
    # Fetch student resources
    student_filter = {
        "subject": subject,
        "grade": grade,
        "audience": "Student"
    }
    
    student_cursor = db.resources.find(student_filter)
    student_resources_data = await student_cursor.to_list(length=None)
    
    # Fetch teacher resources
    teacher_filter = {
        "subject": subject,
        "grade": grade,
        "audience": "Teacher"
    }
    
    teacher_cursor = db.resources.find(teacher_filter)
    teacher_resources_data = await teacher_cursor.to_list(length=None)
    
    # Convert to Resource models
    student_resources = []
    for resource_data in student_resources_data:
        student_resources.append(Resource(
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
    
    teacher_resources = []
    for resource_data in teacher_resources_data:
        teacher_resources.append(Resource(
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
    
    # Check if we have enough resources
    if len(student_resources) < 3:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Insufficient student resources found for {subject} Grade {grade}. Need at least 3, found {len(student_resources)}."
        )
    
    # Step 3: Score and sort student resources
    scored_resources = score_resources(student_resources, keywords)
    
    # Step 4: Construct the journey
    journey = construct_journey(
        scored_resources=scored_resources,
        teacher_resources=teacher_resources,
        prompt=request.prompt,
        subject=subject,
        grade=grade
    )
    
    # Step 5: Build response with full resource details
    # Create a map of resource_id -> Resource for quick lookup
    all_resources = {r.id: r for r in student_resources + teacher_resources}
    
    # Build journey steps with full resource details
    journey_steps = []
    for step in journey.steps:
        resource = all_resources.get(step.resource_id)
        if resource:
            journey_steps.append(JourneyStepResponse(
                step_type=step.step_type,
                resource=ResourceResponse(
                    id=resource.id,
                    title=resource.title,
                    description=resource.description,
                    type=resource.type,
                    audience=resource.audience,
                    duration=resource.duration,
                    subject=resource.subject,
                    grade=resource.grade,
                    tags=resource.tags,
                    thumbnail=resource.thumbnail,
                    content_url=resource.content_url,
                    alignment_score=resource.alignment_score,
                    cultural_relevance=resource.cultural_relevance,
                    created_at=resource.created_at,
                    updated_at=resource.updated_at
                )
            ))
    
    # Return the journey response
    return JourneyResponse(
        id=journey.id,
        title=journey.title,
        grade=journey.grade,
        subject=journey.subject,
        steps=journey_steps,
        created_at=datetime.utcnow().isoformat() + "Z",
        class_code=None  # Not assigned yet, will be assigned when saved
    )


@router.post("/", response_model=JourneyResponse, status_code=status.HTTP_201_CREATED)
async def create_journey(
    request: CreateJourneyRequest,
    current_educator: EducatorResponse = Depends(get_current_educator)
) -> JourneyResponse:
    """
    Save a generated journey to the database.
    
    This endpoint:
    1. Associates the journey with the current educator
    2. Inserts it into the journeys collection
    3. Returns the journey with its MongoDB ObjectId
    
    Args:
        request: CreateJourneyRequest with journey data
        current_educator: Current authenticated educator (from JWT)
        
    Returns:
        JourneyResponse with the created journey including DB ID
    """
    db = get_database()
    
    # Prepare journey document
    journey_doc = {
        "title": request.title,
        "subject": request.subject,
        "grade": request.grade,
        "prompt": request.prompt,
        "steps": [{"step_type": step.step_type, "resource_id": step.resource_id} for step in request.steps],
        "educator_id": current_educator.id,
        "created_at": datetime.utcnow(),
        "class_code": None
    }
    
    # Insert into database
    result = await db.journeys.insert_one(journey_doc)
    journey_id = str(result.inserted_id)
    
    # Fetch resource details for response
    resource_ids = [step.resource_id for step in request.steps]
    resources_cursor = db.resources.find({"_id": {"$in": resource_ids}})
    resources_data = await resources_cursor.to_list(length=None)
    
    # Create resource map
    resources_map = {}
    for resource_data in resources_data:
        resources_map[resource_data["_id"]] = ResourceResponse(
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
    
    # Build journey steps with full resource details
    journey_steps = []
    for step in request.steps:
        resource = resources_map.get(step.resource_id)
        if resource:
            journey_steps.append(JourneyStepResponse(
                step_type=step.step_type,
                resource=resource
            ))
    
    return JourneyResponse(
        id=journey_id,
        title=request.title,
        grade=request.grade,
        subject=request.subject,
        steps=journey_steps,
        created_at=journey_doc["created_at"].isoformat() + "Z",
        class_code=None
    )


@router.get("/{id}", response_model=JourneyResponse)
async def get_journey(
    id: str,
    current_educator: EducatorResponse = Depends(get_current_educator)
) -> JourneyResponse:
    """
    Retrieve a journey by ID.
    
    This endpoint:
    1. Fetches the journey from the database
    2. Verifies the journey belongs to the current educator
    3. Returns the journey with full resource details
    
    Args:
        id: Journey MongoDB ObjectId
        current_educator: Current authenticated educator (from JWT)
        
    Returns:
        JourneyResponse with the journey data
        
    Raises:
        HTTPException: If journey not found or doesn't belong to educator
    """
    db = get_database()
    
    # Validate ObjectId format
    try:
        object_id = ObjectId(id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid journey ID format"
        )
    
    # Fetch journey from database
    journey_data = await db.journeys.find_one({"_id": object_id})
    
    if not journey_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journey not found"
        )
    
    # Verify ownership
    if journey_data.get("educator_id") != current_educator.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this journey"
        )
    
    # Fetch resource details
    resource_ids = [step["resource_id"] for step in journey_data["steps"]]
    resources_cursor = db.resources.find({"_id": {"$in": resource_ids}})
    resources_data = await resources_cursor.to_list(length=None)
    
    # Create resource map
    resources_map = {}
    for resource_data in resources_data:
        resources_map[resource_data["_id"]] = ResourceResponse(
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
    
    # Build journey steps with full resource details
    journey_steps = []
    for step in journey_data["steps"]:
        resource = resources_map.get(step["resource_id"])
        if resource:
            journey_steps.append(JourneyStepResponse(
                step_type=step["step_type"],
                resource=resource
            ))
    
    return JourneyResponse(
        id=str(journey_data["_id"]),
        title=journey_data["title"],
        grade=journey_data["grade"],
        subject=journey_data["subject"],
        steps=journey_steps,
        created_at=journey_data["created_at"].isoformat() + "Z",
        class_code=journey_data.get("class_code")
    )


@router.put("/{id}", response_model=JourneyResponse)
async def update_journey(
    id: str,
    request: UpdateJourneyRequest,
    current_educator: EducatorResponse = Depends(get_current_educator)
) -> JourneyResponse:
    """
    Update a journey (e.g., swap resources).
    
    This endpoint:
    1. Fetches the journey from the database
    2. Verifies ownership
    3. Updates the specified fields
    4. Returns the updated journey
    
    Args:
        id: Journey MongoDB ObjectId
        request: UpdateJourneyRequest with fields to update
        current_educator: Current authenticated educator (from JWT)
        
    Returns:
        JourneyResponse with the updated journey data
        
    Raises:
        HTTPException: If journey not found or doesn't belong to educator
    """
    db = get_database()
    
    # Validate ObjectId format
    try:
        object_id = ObjectId(id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid journey ID format"
        )
    
    # Fetch journey from database
    journey_data = await db.journeys.find_one({"_id": object_id})
    
    if not journey_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journey not found"
        )
    
    # Verify ownership
    if journey_data.get("educator_id") != current_educator.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this journey"
        )
    
    # Prepare update document
    update_doc = {}
    if request.title is not None:
        update_doc["title"] = request.title
    if request.steps is not None:
        update_doc["steps"] = [{"step_type": step.step_type, "resource_id": step.resource_id} for step in request.steps]
    
    # Update in database
    if update_doc:
        await db.journeys.update_one(
            {"_id": object_id},
            {"$set": update_doc}
        )
    
    # Fetch updated journey
    updated_journey = await db.journeys.find_one({"_id": object_id})
    
    # Fetch resource details
    resource_ids = [step["resource_id"] for step in updated_journey["steps"]]
    resources_cursor = db.resources.find({"_id": {"$in": resource_ids}})
    resources_data = await resources_cursor.to_list(length=None)
    
    # Create resource map
    resources_map = {}
    for resource_data in resources_data:
        resources_map[resource_data["_id"]] = ResourceResponse(
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
    
    # Build journey steps with full resource details
    journey_steps = []
    for step in updated_journey["steps"]:
        resource = resources_map.get(step["resource_id"])
        if resource:
            journey_steps.append(JourneyStepResponse(
                step_type=step["step_type"],
                resource=resource
            ))
    
    return JourneyResponse(
        id=str(updated_journey["_id"]),
        title=updated_journey["title"],
        grade=updated_journey["grade"],
        subject=updated_journey["subject"],
        steps=journey_steps,
        created_at=updated_journey["created_at"].isoformat() + "Z",
        class_code=updated_journey.get("class_code")
    )


@router.post("/{id}/deploy", response_model=dict)
async def deploy_journey(
    id: str,
    current_educator: EducatorResponse = Depends(get_current_educator)
) -> dict:
    """
    Deploy a journey with a unique class code for student access.
    
    This endpoint:
    1. Generates a random 6-character uppercase alphanumeric code
    2. Ensures uniqueness by checking the database
    3. Updates the journey with the code and deployed=True
    4. Returns the class code
    
    Args:
        id: Journey MongoDB ObjectId
        current_educator: Current authenticated educator (from JWT)
        
    Returns:
        dict with class_code
        
    Raises:
        HTTPException: If journey not found or doesn't belong to educator
    """
    db = get_database()
    
    # Validate ObjectId format
    try:
        object_id = ObjectId(id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid journey ID format"
        )
    
    # Fetch journey from database
    journey_data = await db.journeys.find_one({"_id": object_id})
    
    if not journey_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journey not found"
        )
    
    # Verify ownership
    if journey_data.get("educator_id") != current_educator.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to deploy this journey"
        )
    
    # Generate unique 6-character code
    max_attempts = 10
    class_code = None
    
    for _ in range(max_attempts):
        # Generate random 6-character uppercase alphanumeric code
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        # Check if code already exists
        existing = await db.journeys.find_one({"class_code": code})
        if not existing:
            class_code = code
            break
    
    if not class_code:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate unique class code. Please try again."
        )
    
    # Update journey with class code and deployed status
    await db.journeys.update_one(
        {"_id": object_id},
        {"$set": {"class_code": class_code, "deployed": True}}
    )
    
    return {"class_code": class_code}


@router.get("/code/{code}", response_model=JourneyResponse)
async def get_journey_by_code(code: str) -> JourneyResponse:
    """
    Retrieve a journey by class code (public endpoint for students).
    
    This endpoint:
    1. Finds the journey by class_code
    2. Filters out teacher-only resources (audience == 'Teacher')
    3. Returns the filtered journey
    
    This is a PUBLIC endpoint - no authentication required.
    
    Args:
        code: The 6-character class code
        
    Returns:
        JourneyResponse with student-accessible steps only
        
    Raises:
        HTTPException: If journey not found or not deployed
    """
    db = get_database()
    
    # Find journey by class code
    journey_data = await db.journeys.find_one({"class_code": code.upper()})
    
    if not journey_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journey not found with this code"
        )
    
    # Check if journey is deployed
    if not journey_data.get("deployed", False):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journey not found with this code"
        )
    
    # Fetch resource details
    resource_ids = [step["resource_id"] for step in journey_data["steps"]]
    resources_cursor = db.resources.find({"_id": {"$in": resource_ids}})
    resources_data = await resources_cursor.to_list(length=None)
    
    # Create resource map
    resources_map = {}
    for resource_data in resources_data:
        resources_map[resource_data["_id"]] = ResourceResponse(
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
    
    # Build journey steps with full resource details, filtering out Teacher resources
    journey_steps = []
    for step in journey_data["steps"]:
        resource = resources_map.get(step["resource_id"])
        if resource and resource.audience != "Teacher":
            journey_steps.append(JourneyStepResponse(
                step_type=step["step_type"],
                resource=resource
            ))
    
    return JourneyResponse(
        id=str(journey_data["_id"]),
        title=journey_data["title"],
        grade=journey_data["grade"],
        subject=journey_data["subject"],
        steps=journey_steps,
        created_at=journey_data["created_at"].isoformat() + "Z",
        class_code=journey_data.get("class_code")
    )