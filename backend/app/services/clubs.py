from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.club import Club
from app.schemas.club import ClubCreate, ClubUpdate

def get_all_clubs(db: Session) -> List[Club]:
    return db.query(Club).all()

def get_club_by_id(db: Session, club_id: str) -> Club:
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return club

def create_club(db: Session, club_data: ClubCreate, admin_id: str) -> Club:
    club = Club(**club_data.model_dump(), admin_id=admin_id)
    db.add(club)
    try:
        db.commit()
        db.refresh(club)
        return club
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error creating club. Slug or name might already exist.")

def update_club(db: Session, club_id: str, club_data: ClubUpdate, admin_id: str) -> Club:
    club = get_club_by_id(db, club_id)
    if club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this club")
    
    update_data = club_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(club, key, value)
        
    db.commit()
    db.refresh(club)
    return club

def delete_club(db: Session, club_id: str, admin_id: str):
    club = get_club_by_id(db, club_id)
    if club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this club")
    
    db.delete(club)
    db.commit()
