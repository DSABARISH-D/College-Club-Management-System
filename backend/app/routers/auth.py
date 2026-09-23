"""
Auth router — registration, login, and current user profile.
"""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserOut, TokenResponse
from app.services.auth import register_user, authenticate_user, create_token_for_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: UserRegister, db: Annotated[Session, Depends(get_db)]):
    """Register a new student account and return a JWT token."""
    user = register_user(db, payload)
    token = create_token_for_user(user)
    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Annotated[Session, Depends(get_db)]):
    """Authenticate and return a JWT token."""
    user = authenticate_user(db, payload.email, payload.password)
    token = create_token_for_user(user)
    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut)
def me(current_user: Annotated[User, Depends(get_current_user)]):
    """Return the currently authenticated user's profile."""
    return UserOut.model_validate(current_user)
