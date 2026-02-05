from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import Dict
import uuid
from database import get_database
from schemas.educator import SignupRequest, LoginRequest, Token, EducatorResponse
from utils.security import hash_password, verify_password, create_access_token
from dependencies.auth import get_current_educator


router = APIRouter(tags=["Authentication"])


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest) -> Token:
    """
    Register a new educator account.
    
    Args:
        request: SignupRequest containing email, password, and name
        
    Returns:
        Token object with access token and educator data
        
    Raises:
        HTTPException: If email already exists
    """
    db = get_database()
    
    # Check if educator with this email already exists
    existing_educator = await db.educators.find_one({"email": request.email})
    
    if existing_educator:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate unique educator ID
    educator_id = f"edu_{uuid.uuid4().hex[:12]}"
    
    # Hash the password
    password_hash = hash_password(request.password)
    
    # Create educator document
    educator_data = {
        "_id": educator_id,
        "email": request.email,
        "password_hash": password_hash,
        "name": request.name,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert into database
    await db.educators.insert_one(educator_data)
    
    # Create access token
    access_token = create_access_token(data={"sub": educator_id})
    
    # Prepare educator response
    educator_response = EducatorResponse(
        id=educator_id,
        email=request.email,
        name=request.name,
        created_at=educator_data["created_at"],
        updated_at=educator_data["updated_at"]
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        educator=educator_response
    )


@router.post("/login", response_model=Token)
async def login(request: LoginRequest) -> Token:
    """
    Authenticate an educator and return access token.
    
    Args:
        request: LoginRequest containing email and password
        
    Returns:
        Token object with access token and educator data
        
    Raises:
        HTTPException: If credentials are invalid
    """
    db = get_database()
    
    # Find educator by email
    educator_data = await db.educators.find_one({"email": request.email})
    
    if not educator_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(request.password, educator_data["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": educator_data["_id"]})
    
    # Prepare educator response
    educator_response = EducatorResponse(
        id=educator_data["_id"],
        email=educator_data["email"],
        name=educator_data["name"],
        created_at=educator_data["created_at"],
        updated_at=educator_data.get("updated_at")
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        educator=educator_response
    )


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout() -> Dict[str, str]:
    """
    Logout endpoint (client-side token removal).
    
    Returns:
        Success message
        
    Note:
        JWT tokens are stateless, so logout is primarily handled client-side
        by removing the token from storage. This endpoint exists for consistency
        and can be extended for token blacklisting if needed.
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=EducatorResponse)
async def get_current_user(
    current_educator: EducatorResponse = Depends(get_current_educator)
) -> EducatorResponse:
    """
    Get current authenticated educator's profile.
    
    Args:
        current_educator: Current educator from JWT token (injected by dependency)
        
    Returns:
        EducatorResponse with current educator data
    """
    return current_educator