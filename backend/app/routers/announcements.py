"""
Announcements router — CRUD for club announcements.
"""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementOut
from app.services.announcement import (
    list_club_announcements,
    list_all_announcements,
    create_announcement,
    update_announcement,
    delete_announcement,
)

router = APIRouter(tags=["Announcements"])


@router.get("/api/announcements", response_model=list[AnnouncementOut])
def all_announcements(
    db: Annotated[Session, Depends(get_db)],
    _current_user: Annotated[User, Depends(get_current_user)],
):
    """List all announcements across all clubs."""
    return list_all_announcements(db, _current_user)


@router.get("/api/clubs/{slug}/announcements", response_model=list[AnnouncementOut])
def club_announcements(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    _current_user: Annotated[User, Depends(get_current_user)],
):
    """List all announcements for a specific club."""
    return list_club_announcements(db, slug, _current_user)


@router.post(
    "/api/clubs/{slug}/announcements",
    response_model=AnnouncementOut,
    status_code=201,
)
def create(
    slug: str,
    payload: AnnouncementCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Create a new announcement (admin only)."""
    return create_announcement(db, slug, admin, payload)


@router.put("/api/announcements/{announcement_id}", response_model=AnnouncementOut)
def update(
    announcement_id: str,
    payload: AnnouncementUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Update an announcement (admin only)."""
    return update_announcement(db, announcement_id, admin, payload)


@router.delete("/api/announcements/{announcement_id}")
def delete(
    announcement_id: str,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Delete an announcement (admin only)."""
    return delete_announcement(db, announcement_id, admin)


from app.schemas.announcement import AnnouncementApproval
from app.dependencies import require_club_coordinator
from app.services.announcement import approve_announcement

@router.patch("/api/announcements/{announcement_id}/approval", response_model=AnnouncementOut)
def approve(
    announcement_id: str,
    payload: AnnouncementApproval,
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """Approve or reject an announcement (Club Coordinator only)."""
    return approve_announcement(db, announcement_id, coordinator, payload.status, payload.rejection_reason)
