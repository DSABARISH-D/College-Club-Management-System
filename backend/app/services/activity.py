from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.activity import Activity
from app.models.club import Club
from app.models.user import User
from app.schemas.activity import ActivityCreate, ActivityUpdate

def list_all_activities(db: Session, user: User, status: str = None):
    query = db.query(Activity)
    if status:
        query = query.filter(Activity.status == status)
        
    query = query.filter(Activity.approval_status == "APPROVED")
    
    activities = query.order_by(Activity.start_date.desc()).all()
    results = []
    for a in activities:
        club = db.query(Club).filter(Club.id == a.club_id).first()
        a_dict = {
            "id": a.id,
            "club_id": a.club_id,
            "title": a.title,
            "description": a.description,
            "venue": a.venue,
            "link": a.link,
            "start_date": a.start_date,
            "end_date": a.end_date,
            "status": a.status,
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

def list_club_activities(db: Session, slug: str, user: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    
    query = db.query(Activity).filter(Activity.club_id == club.id)
    
    if user.id != club.admin_id:
        query = query.filter(Activity.approval_status == "APPROVED")
        
    activities = query.order_by(Activity.start_date.desc()).all()
    results = []
    for a in activities:
        a_dict = {
            "id": a.id,
            "club_id": a.club_id,
            "title": a.title,
            "description": a.description,
            "venue": a.venue,
            "link": a.link,
            "start_date": a.start_date,
            "end_date": a.end_date,
            "status": a.status,
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

def get_activity(db: Session, activity_id: str):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    club = db.query(Club).filter(Club.id == activity.club_id).first()
    a_dict = {
        "id": activity.id,
        "club_id": activity.club_id,
        "title": activity.title,
        "description": activity.description,
        "venue": activity.venue,
        "link": activity.link,
        "start_date": activity.start_date,
        "end_date": activity.end_date,
        "status": activity.status,
        "approval_status": getattr(activity, "approval_status", "PENDING"),
        "approved_by": getattr(activity, "approved_by", None),
        "approved_at": getattr(activity, "approved_at", None),
        "rejection_reason": getattr(activity, "rejection_reason", None),
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "club_name": club.name if club else "Unknown",
        "club_slug": club.slug if club else "unknown"
    }
    return a_dict

def create_activity(db: Session, slug: str, admin: User, payload: ActivityCreate):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    if club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    activity = Activity(
        club_id=club.id,
        title=payload.title,
        description=payload.description,
        venue=payload.venue,
        link=payload.link,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status=payload.status,
        approval_status="PENDING"
    )
    db.add(activity)
    db.commit()
    db.refresh(activity)
    
    return {
        "id": activity.id,
        "club_id": activity.club_id,
        "title": activity.title,
        "description": activity.description,
        "venue": activity.venue,
        "link": activity.link,
        "start_date": activity.start_date,
        "end_date": activity.end_date,
        "status": activity.status,
        "approval_status": getattr(activity, "approval_status", "PENDING"),
        "approved_by": getattr(activity, "approved_by", None),
        "approved_at": getattr(activity, "approved_at", None),
        "rejection_reason": getattr(activity, "rejection_reason", None),
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "club_name": club.name,
        "club_slug": club.slug
    }

def update_activity(db: Session, activity_id: str, admin: User, payload: ActivityUpdate):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    club = db.query(Club).filter(Club.id == activity.club_id).first()
    if not club or club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(activity, key, value)
        
    db.commit()
    db.refresh(activity)
    return {
        "id": activity.id,
        "club_id": activity.club_id,
        "title": activity.title,
        "description": activity.description,
        "venue": activity.venue,
        "link": activity.link,
        "start_date": activity.start_date,
        "end_date": activity.end_date,
        "status": activity.status,
        "approval_status": getattr(activity, "approval_status", "PENDING"),
        "approved_by": getattr(activity, "approved_by", None),
        "approved_at": getattr(activity, "approved_at", None),
        "rejection_reason": getattr(activity, "rejection_reason", None),
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "club_name": club.name,
        "club_slug": club.slug
    }

def delete_activity(db: Session, activity_id: str, admin: User):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    club = db.query(Club).filter(Club.id == activity.club_id).first()
    if not club or club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(activity)
    db.commit()
    return {"message": "Activity deleted"}

def approve_activity(db: Session, activity_id: str, coordinator: User, status: str, rejection_reason: str = None):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    club = db.query(Club).filter(Club.id == activity.club_id).first()
    if not club or club.coordinator_id != coordinator.id:
        raise HTTPException(status_code=403, detail="Not authorized. You are not the coordinator for this club.")
        
    from datetime import datetime
    activity.approval_status = status
    activity.approved_by = coordinator.id
    activity.approved_at = datetime.utcnow()
    activity.rejection_reason = rejection_reason if status == 'REJECTED' else None
    
    db.commit()
    db.refresh(activity)
    return {
        "id": activity.id,
        "club_id": activity.club_id,
        "title": activity.title,
        "description": activity.description,
        "venue": activity.venue,
        "link": activity.link,
        "start_date": activity.start_date,
        "end_date": activity.end_date,
        "status": activity.status,
        "created_at": activity.created_at,
        "updated_at": activity.updated_at,
        "approval_status": activity.approval_status,
        "approved_by": activity.approved_by,
        "approved_at": activity.approved_at,
        "rejection_reason": activity.rejection_reason,
        "club_name": club.name,
        "club_slug": club.slug
    }
