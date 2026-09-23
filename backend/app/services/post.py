from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.post import ClubPost
from app.models.club import Club
from app.schemas.post import PostCreate, PostUpdate

def get_posts_by_club(db: Session, club_id: str):
    return db.query(ClubPost).filter(ClubPost.club_id == club_id).order_by(ClubPost.created_at.desc()).all()

def get_approved_posts_by_club(db: Session, club_id: str):
    return db.query(ClubPost).filter(
        ClubPost.club_id == club_id, 
        ClubPost.approval_status == "APPROVED"
    ).order_by(ClubPost.created_at.desc()).all()

def create_post(db: Session, club: Club, payload: PostCreate):
    post = ClubPost(
        club_id=club.id,
        title=payload.title,
        content=payload.content,
        image_url=payload.image_url,
        approval_status="PENDING"
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def get_post(db: Session, post_id: str):
    post = db.query(ClubPost).filter(ClubPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

def update_post(db: Session, post: ClubPost, payload: PostUpdate):
    if payload.title is not None:
        post.title = payload.title
    if payload.content is not None:
        post.content = payload.content
    if payload.image_url is not None:
        post.image_url = payload.image_url
        
    db.commit()
    db.refresh(post)
    return post

def delete_post(db: Session, post: ClubPost):
    db.delete(post)
    db.commit()
