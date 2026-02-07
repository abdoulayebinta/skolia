from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from database import get_database
from utils.security import decode_access_token
from schemas.educator import EducatorResponse


# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_educator(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> EducatorResponse:
    """
    Dependency to get the current authenticated educator from JWT token.

    Args:
        credentials: HTTP Bearer token credentials

    Returns:
        EducatorResponse object with current educator data

    Raises:
        HTTPException: If token is invalid or educator not found
    """
    token = credentials.credentials

    # Decode the JWT token
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract educator ID from token
    educator_id: Optional[str] = payload.get("sub")

    if educator_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch educator from database
    db = get_database()
    educator_data = await db.educators.find_one({"_id": educator_id})

    if educator_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Educator not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Convert MongoDB document to EducatorResponse
    return EducatorResponse(
        id=educator_data["_id"],
        email=educator_data["email"],
        name=educator_data["name"],
        created_at=educator_data["created_at"],
        updated_at=educator_data.get("updated_at")
    )