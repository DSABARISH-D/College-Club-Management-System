from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.club import Club
from app.models.membership import ClubMembership
from app.models.user import User
from app.schemas.club import ClubUpdate

def list_clubs(db: Session, current_user: User, search: str = None, category: str = None):
    query = db.query(Club)
    if search:
        query = query.filter(Club.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Club.category == category)
        
    clubs = query.all()
    results = []
    for club in clubs:
        member_count = db.query(ClubMembership).filter(ClubMembership.club_id == club.id).count()
        is_member = False
        if current_user:
            is_member = db.query(ClubMembership).filter(
                ClubMembership.club_id == club.id, 
                ClubMembership.user_id == current_user.id
            ).first() is not None
            
        club_dict = {
            "id": club.id,
            "name": club.name,
            "slug": club.slug,
            "description": club.description,
            "category": club.category,
            "logo_url": club.logo_url,
            "banner_url": club.banner_url,
            "admin_id": club.admin_id,
            "created_at": club.created_at,
            "member_count": member_count,
            "is_member": is_member
        }
        results.append(club_dict)
    return results

def get_club_categories(db: Session):
    categories = db.query(Club.category).distinct().all()
    return [c[0] for c in categories if c[0]]

def get_club_by_slug(db: Session, slug: str, current_user: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    member_count = db.query(ClubMembership).filter(ClubMembership.club_id == club.id).count()
    is_member = False
    if current_user:
        is_member = db.query(ClubMembership).filter(
            ClubMembership.club_id == club.id, 
            ClubMembership.user_id == current_user.id
        ).first() is not None
        
    club_dict = {
        "id": club.id,
        "name": club.name,
        "slug": club.slug,
        "description": club.description,
        "category": club.category,
        "logo_url": club.logo_url,
        "banner_url": club.banner_url,
        "admin_id": club.admin_id,
        "created_at": club.created_at,
        "member_count": member_count,
        "is_member": is_member
    }
    return club_dict

def update_club(db: Session, slug: str, admin: User, payload: ClubUpdate):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    if club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(club, key, value)
        
    db.commit()
    db.refresh(club)
    
    # Return dict with extra fields expected by schema if necessary, or just the club
    member_count = db.query(ClubMembership).filter(ClubMembership.club_id == club.id).count()
    club_dict = {
        "id": club.id,
        "name": club.name,
        "slug": club.slug,
        "description": club.description,
        "category": club.category,
        "logo_url": club.logo_url,
        "banner_url": club.banner_url,
        "admin_id": club.admin_id,
        "created_at": club.created_at,
        "member_count": member_count,
        "is_member": True  # Admin is technically a member or we can ignore
    }
    return club_dict

def get_club_by_id(db: Session, club_id: str):
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return club

def verify_club_admin(db: Session, club_id: str, admin_id: str):
    club = get_club_by_id(db, club_id)
    if club.admin_id != admin_id:
        raise HTTPException(status_code=403, detail="Not authorized to manage this club")
    return club
