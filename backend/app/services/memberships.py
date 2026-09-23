from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from app.models.membership import ClubMembership
from app.schemas.membership import MembershipCreate

def join_club(db: Session, user_id: str, membership_data: MembershipCreate) -> ClubMembership:
    membership = ClubMembership(user_id=user_id, club_id=membership_data.club_id)
    db.add(membership)
    try:
        db.commit()
        db.refresh(membership)
        return membership
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="User is already a member of this club")

def get_user_memberships(db: Session, user_id: str) -> List[ClubMembership]:
    return db.query(ClubMembership).filter(ClubMembership.user_id == user_id).all()

def get_club_members(db: Session, club_id: str) -> List[ClubMembership]:
    return db.query(ClubMembership).filter(ClubMembership.club_id == club_id).all()

def leave_club(db: Session, user_id: str, club_id: str):
    membership = db.query(ClubMembership).filter(
        ClubMembership.user_id == user_id, 
        ClubMembership.club_id == club_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
        
    db.delete(membership)
    db.commit()

def remove_member(db: Session, club_id: str, target_user_id: str, admin_id: str):
    # Check if user requesting removal is the club admin
    from app.models.club import Club
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to remove members from this club")
        
    leave_club(db, target_user_id, club_id)
