from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.dependencies import get_db, require_club_coordinator
from app.models.user import User
from app.models.club import Club
from app.models.membership import ClubMembership
from app.models.activity import Activity
from app.models.announcement import Announcement

router = APIRouter(tags=["Coordinator Analytics"])

@router.get("/api/coordinator/analytics")
def get_coordinator_analytics(
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """Get analytics dashboard data for the club coordinator."""
    
    # Base query for clubs managed by this coordinator
    managed_clubs = db.query(Club).filter(Club.coordinator_id == coordinator.id).all()
    managed_club_ids = [c.id for c in managed_clubs]
    
    if not managed_club_ids:
        return {
            "total_clubs": 0,
            "total_members": 0,
            "total_activities": 0,
            "pending_approvals": 0,
            "activities_by_club": [],
            "members_by_club": [],
            "recent_activities": [],
        }

    # Aggregate counts
    total_clubs = len(managed_clubs)
    total_members = db.query(func.count(ClubMembership.id)).filter(ClubMembership.club_id.in_(managed_club_ids)).scalar() or 0
    total_activities = db.query(func.count(Activity.id)).filter(Activity.club_id.in_(managed_club_ids)).scalar() or 0
    
    # Pending Approvals count (Activities + Announcements)
    pending_activities = db.query(func.count(Activity.id)).filter(
        Activity.club_id.in_(managed_club_ids), 
        Activity.approval_status == 'PENDING'
    ).scalar() or 0
    
    pending_announcements = db.query(func.count(Announcement.id)).filter(
        Announcement.club_id.in_(managed_club_ids), 
        Announcement.approval_status == 'PENDING'
    ).scalar() or 0
    
    pending_approvals = pending_activities + pending_announcements

    # Activities by club (for charts)
    activities_by_club = []
    members_by_club = []
    
    for club in managed_clubs:
        act_count = db.query(func.count(Activity.id)).filter(Activity.club_id == club.id).scalar() or 0
        mem_count = db.query(func.count(ClubMembership.id)).filter(ClubMembership.club_id == club.id).scalar() or 0
        
        activities_by_club.append({"name": club.name, "count": act_count})
        members_by_club.append({"name": club.name, "count": mem_count})

    # Recent activities (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_activities = db.query(Activity).filter(
        Activity.club_id.in_(managed_club_ids),
        Activity.created_at >= thirty_days_ago
    ).order_by(Activity.created_at.desc()).limit(5).all()

    recent_acts_data = []
    for a in recent_activities:
        club_name = next((c.name for c in managed_clubs if c.id == a.club_id), "Unknown")
        recent_acts_data.append({
            "id": a.id,
            "title": a.title,
            "club_name": club_name,
            "status": a.status,
            "created_at": a.created_at
        })

    return {
        "total_clubs": total_clubs,
        "total_members": total_members,
        "total_activities": total_activities,
        "pending_approvals": pending_approvals,
        "activities_by_club": activities_by_club,
        "members_by_club": members_by_club,
        "recent_activities": recent_acts_data,
    }
