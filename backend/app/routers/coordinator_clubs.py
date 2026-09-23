from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.dependencies import get_db, require_club_coordinator
from app.models.user import User
from app.models.club import Club
from app.models.membership import ClubMembership
from app.models.activity import Activity
from app.models.announcement import Announcement
from pydantic import BaseModel
import re

router = APIRouter(tags=["Coordinator Clubs"])

class ClubCreate(BaseModel):
    name: str
    description: str | None = None
    category: str | None = None
    admin_email: str

class ClubUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    category: str | None = None
    is_active: bool | None = None

def generate_slug(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

@router.get("/api/coordinator/clubs")
def list_managed_clubs(
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """List all clubs managed by this coordinator, with basic stats."""
    clubs = db.query(Club).filter(Club.coordinator_id == coordinator.id).all()
    results = []
    
    for club in clubs:
        member_count = db.query(func.count(ClubMembership.id)).filter(ClubMembership.club_id == club.id).scalar()
        activity_count = db.query(func.count(Activity.id)).filter(Activity.club_id == club.id).scalar()
        
        results.append({
            "id": club.id,
            "name": club.name,
            "slug": club.slug,
            "category": club.category,
            "is_active": club.is_active,
            "member_count": member_count,
            "activity_count": activity_count,
            "created_at": club.created_at
        })
        
    return results

@router.post("/api/coordinator/clubs")
def create_club(
    payload: ClubCreate,
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """Create a new club under this coordinator's purview."""
    # Ensure name is unique
    if db.query(Club).filter(Club.name == payload.name).first():
        raise HTTPException(status_code=400, detail="Club with this name already exists")
        
    # Find the student coordinator (admin)
    admin_user = db.query(User).filter(User.email == payload.admin_email).first()
    if not admin_user:
        raise HTTPException(status_code=404, detail=f"User with email {payload.admin_email} not found")
        
    if admin_user.role != "CLUB_ADMIN":
        # Upgrade them to CLUB_ADMIN if they aren't already
        admin_user.role = "CLUB_ADMIN"
        
    slug = generate_slug(payload.name)
    
    new_club = Club(
        name=payload.name,
        slug=slug,
        description=payload.description,
        category=payload.category,
        admin_id=admin_user.id,
        coordinator_id=coordinator.id,
        is_active=True
    )
    
    db.add(new_club)
    db.commit()
    db.refresh(new_club)
    
    return {
        "id": new_club.id,
        "name": new_club.name,
        "slug": new_club.slug
    }

@router.patch("/api/coordinator/clubs/{club_id}")
def update_club(
    club_id: str,
    payload: ClubUpdate,
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """Update club details or deactivate a club."""
    club = db.query(Club).filter(Club.id == club_id, Club.coordinator_id == coordinator.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found or you don't have permission")
        
    update_data = payload.model_dump(exclude_unset=True)
    if "name" in update_data and update_data["name"] != club.name:
        if db.query(Club).filter(Club.name == update_data["name"]).first():
            raise HTTPException(status_code=400, detail="Club with this name already exists")
        club.slug = generate_slug(update_data["name"])
        
    for key, value in update_data.items():
        setattr(club, key, value)
        
    db.commit()
    db.refresh(club)
    
    return {
        "id": club.id,
        "name": club.name,
        "is_active": club.is_active
    }

@router.get("/api/coordinator/clubs/{club_id}/members")
def list_club_members(
    club_id: str,
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)],
):
    """View all members of a specific club."""
    club = db.query(Club).filter(Club.id == club_id, Club.coordinator_id == coordinator.id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found or you don't have permission")
        
    memberships = db.query(ClubMembership).filter(ClubMembership.club_id == club.id).all()
    results = []
    
    for m in memberships:
        user = db.query(User).filter(User.id == m.user_id).first()
        if user:
            results.append({
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "roll_number": user.roll_number,
                "department": user.department,
                "joined_at": m.joined_at
            })
            
    return results
