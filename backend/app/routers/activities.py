"""
Activities router — CRUD for club activities/events.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityUpdate, ActivityOut
from app.services.activity import (
    list_club_activities,
    list_all_activities,
    get_activity,
    create_activity,
    update_activity,
    delete_activity,
)

router = APIRouter(tags=["Activities"])


@router.get("/api/activities", response_model=list[ActivityOut])
def all_activities(
    db: Annotated[Session, Depends(get_db)],
    _current_user: Annotated[User, Depends(get_current_user)],
    status: str | None = Query(None, description="Filter by status"),
):
    """List all activities across all clubs."""
    return list_all_activities(db, _current_user, status)


@router.get("/api/activities/{activity_id}", response_model=ActivityOut)
def activity_detail(
    activity_id: str,
    db: Annotated[Session, Depends(get_db)],
    _current_user: Annotated[User, Depends(get_current_user)],
):
    """Get a single activity by ID."""
    return get_activity(db, activity_id)


@router.get("/api/clubs/{slug}/activities", response_model=list[ActivityOut])
def club_activities(
    slug: str,
    db: Annotated[Session, Depends(get_db)],
    _current_user: Annotated[User, Depends(get_current_user)],
):
    """List all activities for a specific club."""
    return list_club_activities(db, slug, _current_user)


@router.post("/api/clubs/{slug}/activities", response_model=ActivityOut, status_code=201)
def create(
    slug: str,
    payload: ActivityCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Create a new activity (admin only)."""
    return create_activity(db, slug, admin, payload)


@router.put("/api/activities/{activity_id}", response_model=ActivityOut)
def update(
    activity_id: str,
    payload: ActivityUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Update an activity (admin only)."""
    return update_activity(db, activity_id, admin, payload)


@router.delete("/api/activities/{activity_id}")
def delete(
    activity_id: str,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Delete an activity (admin only)."""
    return delete_activity(db, activity_id, admin)


from app.schemas.activity import ActivityApproval
from app.dependencies import require_club_coordinator
from app.services.activity import approve_activity

@router.patch("/api/activities/{activity_id}/approval", response_model=ActivityOut)
def approve(
    activity_id: str,
    payload: ActivityApproval,
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """Approve or reject an activity (Club Coordinator only)."""
    return approve_activity(db, activity_id, coordinator, payload.status, payload.rejection_reason)
