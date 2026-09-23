"""
Memberships router — join, leave, list members, remove member, my clubs.
"""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.services.membership import (
    join_club,
    leave_club,
    get_club_members,
    remove_member,
    get_user_clubs,
)

router = APIRouter(tags=["Memberships"])


@router.post("/api/clubs/{slug}/join")
def join(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Student joins a club."""
    return join_club(db, slug, current_user)


@router.delete("/api/clubs/{slug}/leave")
def leave(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """Student leaves a club."""
    return leave_club(db, slug, current_user)


@router.get("/api/clubs/{slug}/members")
def members(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """List club members (admin only)."""
    return get_club_members(db, slug, admin)


@router.delete("/api/clubs/{slug}/members/{user_id}")
def remove(
    slug: str,
    user_id: str,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Remove a member from a club (admin only)."""
    return remove_member(db, slug, user_id, admin)


@router.get("/api/me/clubs")
def my_clubs(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    """List clubs the current user has joined."""
    return get_user_clubs(db, current_user)
