from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.club import Club
from app.models.membership import ClubMembership
from app.models.user import User

def join_club(db: Session, slug: str, current_user: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    existing = db.query(ClubMembership).filter(
        ClubMembership.club_id == club.id,
        ClubMembership.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined")
        
    membership = ClubMembership(club_id=club.id, user_id=current_user.id)
    db.add(membership)
    db.commit()
    return {"message": "Successfully joined"}

def leave_club(db: Session, slug: str, current_user: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
        
    membership = db.query(ClubMembership).filter(
        ClubMembership.club_id == club.id,
        ClubMembership.user_id == current_user.id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=400, detail="Not a member")
        
    db.delete(membership)
    db.commit()
    return {"message": "Successfully left"}

def get_club_members(db: Session, slug: str, admin: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    if club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    memberships = db.query(ClubMembership).filter(ClubMembership.club_id == club.id).all()
    results = []
    for m in memberships:
        user = db.query(User).filter(User.id == m.user_id).first()
        results.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "department": user.department,
            "roll_number": user.roll_number,
            "joined_at": m.joined_at
        })
    return results

def remove_member(db: Session, slug: str, user_id: str, admin: User):
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    if club.admin_id != admin.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    membership = db.query(ClubMembership).filter(
        ClubMembership.club_id == club.id,
        ClubMembership.user_id == user_id
    ).first()
    
    if membership:
        db.delete(membership)
        db.commit()
    return {"message": "Member removed"}

def get_user_clubs(db: Session, current_user: User):
    memberships = db.query(ClubMembership).filter(ClubMembership.user_id == current_user.id).all()
    results = []
    for m in memberships:
        club = db.query(Club).filter(Club.id == m.club_id).first()
        if club:
            results.append({
                "id": m.id,
                "club_id": club.id,
                "club_name": club.name,
                "club_slug": club.slug,
                "club_category": club.category,
                "club_logo_url": club.logo_url,
                "joined_at": m.joined_at
            })
    return results
