from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.announcement import Announcement
from app.models.club import Club
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate

def get_announcements(db: Session, club_id: str = None) -> List[Announcement]:
    query = db.query(Announcement)
    if club_id:
        query = query.filter(Announcement.club_id == club_id)
    return query.order_by(Announcement.created_at.desc()).all()

def create_announcement(db: Session, announcement_data: AnnouncementCreate, admin_id: str) -> Announcement:
    club = db.query(Club).filter(Club.id == announcement_data.club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to post announcements for this club")
        
    announcement = Announcement(**announcement_data.model_dump())
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

def update_announcement(db: Session, announcement_id: str, announcement_data: AnnouncementUpdate, admin_id: str) -> Announcement:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    club = db.query(Club).filter(Club.id == announcement.club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this announcement")
        
    update_data = announcement_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(announcement, key, value)
        
    db.commit()
    db.refresh(announcement)
    return announcement

def delete_announcement(db: Session, announcement_id: str, admin_id: str):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    club = db.query(Club).filter(Club.id == announcement.club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this announcement")
        
    db.delete(announcement)
    db.commit()
