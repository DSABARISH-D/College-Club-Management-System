from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.announcement import Announcement
from app.models.club import Club
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate

def list_all_announcements(db: Session, user: User):
    query = db.query(Announcement)
    query = query.filter(Announcement.approval_status == "APPROVED")
        
    announcements = query.order_by(Announcement.created_at.desc()).all()
    results = []
    for a in announcements:
        club = db.query(Club).filter(Club.id == a.club_id).first()
        a_dict = {
            "id": a.id,
            "club_id": a.club_id,
            "title": a.title,
            "content": a.content,
            "link": a.link,
            "priority": a.priority,
            "approval_status": getattr(a, "approval_status", "PENDING"),
            "approved_by": getattr(a, "approved_by", None),
            "approved_at": getattr(a, "approved_at", None),
            "rejection_reason": getattr(a, "rejection_reason", None),
            "created_at": a.created_at,
            "updated_at": a.updated_at,
            "club_name": club.name if club else "Unknown",
            "club_slug": club.slug if club else "unknown"
        }
        results.append(a_dict)
    return results

def list_club_announcements(db: Session, slug: str, user: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    query = db.query(Announcement).filter(Announcement.club_id == club.id)
    if user.id != club.admin_id:
        query = query.filter(Announcement.approval_status == "APPROVED")
        
    announcements = query.order_by(Announcement.created_at.desc()).all()
    results = []
    for a in announcements:
        a_dict = {
            "id": a.id,
            "club_id": a.club_id,
            "title": a.title,
            "content": a.content,
            "link": a.link,
            "priority": a.priority,
            "approval_status": getattr(a, "approval_status", "PENDING"),
            "approved_by": getattr(a, "approved_by", None),
            "approved_at": getattr(a, "approved_at", None),
            "rejection_reason": getattr(a, "rejection_reason", None),
            "created_at": a.created_at,
            "updated_at": a.updated_at,
            "club_name": club.name,
            "club_slug": club.slug
        }
        results.append(a_dict)
    return results

def create_announcement(db: Session, slug: str, admin: User, payload: AnnouncementCreate):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    if club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    announcement = Announcement(
        club_id=club.id,
        title=payload.title,
        content=payload.content,
        link=payload.link,
        priority=payload.priority,
        approval_status="PENDING"
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    
    return {
        "id": announcement.id,
        "club_id": announcement.club_id,
        "title": announcement.title,
        "content": announcement.content,
        "link": announcement.link,
        "priority": announcement.priority,
        "approval_status": getattr(announcement, "approval_status", "PENDING"),
        "approved_by": getattr(announcement, "approved_by", None),
        "approved_at": getattr(announcement, "approved_at", None),
        "rejection_reason": getattr(announcement, "rejection_reason", None),
        "created_at": announcement.created_at,
        "updated_at": announcement.updated_at,
        "club_name": club.name,
        "club_slug": club.slug
    }

def update_announcement(db: Session, announcement_id: str, admin: User, payload: AnnouncementUpdate):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    club = db.query(Club).filter(Club.id == announcement.club_id).first()
    if not club or club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(announcement, key, value)
        
    db.commit()
    db.refresh(announcement)
    return {
        "id": announcement.id,
        "club_id": announcement.club_id,
        "title": announcement.title,
        "content": announcement.content,
        "priority": announcement.priority,
        "approval_status": getattr(announcement, "approval_status", "PENDING"),
        "approved_by": getattr(announcement, "approved_by", None),
        "approved_at": getattr(announcement, "approved_at", None),
        "rejection_reason": getattr(announcement, "rejection_reason", None),
        "created_at": announcement.created_at,
        "updated_at": announcement.updated_at,
        "club_name": club.name,
        "club_slug": club.slug
    }

def delete_announcement(db: Session, announcement_id: str, admin: User):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    club = db.query(Club).filter(Club.id == announcement.club_id).first()
    if not club or club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(announcement)
    db.commit()
    return {"message": "Announcement deleted"}

def approve_announcement(db: Session, announcement_id: str, coordinator: User, status: str, rejection_reason: str = None):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
        
    club = db.query(Club).filter(Club.id == announcement.club_id).first()
    if not club or club.coordinator_id != coordinator.id:
        raise HTTPException(status_code=403, detail="Not authorized. You are not the coordinator for this club.")
        
    from datetime import datetime
    announcement.approval_status = status
    announcement.approved_by = coordinator.id
    announcement.approved_at = datetime.utcnow()
    announcement.rejection_reason = rejection_reason if status == 'REJECTED' else None
    
    db.commit()
    db.refresh(announcement)
    return {
        "id": announcement.id,
        "club_id": announcement.club_id,
        "title": announcement.title,
        "content": announcement.content,
        "priority": announcement.priority,
        "created_at": announcement.created_at,
        "updated_at": announcement.updated_at,
        "approval_status": announcement.approval_status,
        "approved_by": announcement.approved_by,
        "approved_at": announcement.approved_at,
        "rejection_reason": announcement.rejection_reason,
        "club_name": club.name,
        "club_slug": club.slug
    }
