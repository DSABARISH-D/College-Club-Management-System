"""
Clubs router — listing, detail, update, and categories.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.schemas.club import ClubOut, ClubUpdate
from app.services.club import list_clubs, get_club_by_slug, update_club, get_club_categories

router = APIRouter(prefix="/api/clubs", tags=["Clubs"])


@router.get("", response_model=list[ClubOut])
def get_clubs(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
    search: str | None = Query(None, description="Search clubs by name"),
    category: str | None = Query(None, description="Filter by category"),
):
    """List all clubs with member counts and membership status."""
    return list_clubs(db, current_user, search, category)


@router.get("/categories", response_model=list[str])
def get_categories(db: Annotated[Session, Depends(get_db)]):
    """Return all distinct club categories."""
    return get_club_categories(db)


@router.get("/{slug}", response_model=ClubOut)
def get_club(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Get club details by slug."""
    return get_club_by_slug(db, slug, current_user)


@router.put("/{slug}", response_model=ClubOut)
def update_club_info(
    slug: str,
    payload: ClubUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Update club information (admin only)."""
    return update_club(db, slug, admin, payload)
