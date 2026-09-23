from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.activity import Activity
from app.models.club import Club
from app.schemas.activity import ActivityCreate, ActivityUpdate

def get_activities(db: Session, club_id: str = None) -> List[Activity]:
    query = db.query(Activity)
    if club_id:
        query = query.filter(Activity.club_id == club_id)
    return query.order_by(Activity.start_date.asc()).all()

def create_activity(db: Session, activity_data: ActivityCreate, admin_id: str) -> Activity:
    club = db.query(Club).filter(Club.id == activity_data.club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to add activities for this club")
        
    activity = Activity(**activity_data.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

def update_activity(db: Session, activity_id: str, activity_data: ActivityUpdate, admin_id: str) -> Activity:
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    club = db.query(Club).filter(Club.id == activity.club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this activity")
        
    update_data = activity_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(activity, key, value)
        
    db.commit()
    db.refresh(activity)
    return activity

def delete_activity(db: Session, activity_id: str, admin_id: str):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    club = db.query(Club).filter(Club.id == activity.club_id).first()
    if not club or club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this activity")
        
    db.delete(activity)
    db.commit()
