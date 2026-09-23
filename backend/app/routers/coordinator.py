from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_db, require_club_coordinator
from app.models.user import User
from app.models.club import Club
from app.models.activity import Activity
from app.models.announcement import Announcement

router = APIRouter(tags=["Coordinator"])

@router.get("/api/coordinator/pending")
def get_pending_approvals(
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """Get all pending activities and announcements for clubs managed by this coordinator."""
    # Find all clubs coordinated by this user
    clubs = db.query(Club).filter(Club.coordinator_id == coordinator.id).all()
    club_ids = [club.id for club in clubs]
    
    if not club_ids:
        return {"activities": [], "announcements": []}
        
    activities = db.query(Activity).filter(
        Activity.club_id.in_(club_ids),
        Activity.approval_status == "PENDING"
    ).all()
    
    announcements = db.query(Announcement).filter(
        Announcement.club_id.in_(club_ids),
        Announcement.approval_status == "PENDING"
    ).all()
    
    from app.models.post import ClubPost
    posts = db.query(ClubPost).filter(
        ClubPost.club_id.in_(club_ids),
        ClubPost.approval_status == "PENDING"
    ).all()
    
    # Format the results
    pending_activities = []
    for a in activities:
        club = next(c for c in clubs if c.id == a.club_id)
        pending_activities.append({
            "id": a.id,
            "title": a.title,
            "club_name": club.name,
            "created_at": a.created_at,
            "type": "Activity"
        })
        
    pending_announcements = []
    for a in announcements:
        club = next(c for c in clubs if c.id == a.club_id)
        pending_announcements.append({
            "id": a.id,
            "title": a.title,
            "club_name": club.name,
            "created_at": a.created_at,
            "type": "Announcement"
        })
        
    pending_posts = []
    for p in posts:
        club = next(c for c in clubs if c.id == p.club_id)
        pending_posts.append({
            "id": p.id,
            "title": p.title,
            "club_name": club.name,
            "created_at": p.created_at,
            "type": "Post"
        })
        
    return {
        "activities": pending_activities,
        "announcements": pending_announcements,
        "posts": pending_posts
    }
