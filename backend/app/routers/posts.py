from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_admin, require_club_coordinator
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostOut
from app.services import post as post_service
from app.services.club import get_club_by_id, verify_club_admin

router = APIRouter(tags=["Posts"])

from app.models.club import Club

@router.get("/api/clubs/{slug}/posts", response_model=List[PostOut])
def get_club_posts(slug: str, db: Annotated[Session, Depends(get_db)]):
    """Get approved posts for a club (public)."""
    club = db.query(Club).filter(Club.slug == slug).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    return post_service.get_approved_posts_by_club(db, club.id)

@router.get("/api/admin/clubs/{club_id}/posts", response_model=List[PostOut])
def get_club_posts_admin(
    club_id: str, 
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)]
):
    """Get all posts for a club (including pending/rejected) for the club admin."""
    verify_club_admin(db, club_id, admin.id)
    return post_service.get_posts_by_club(db, club_id)

@router.post("/api/admin/clubs/{club_id}/posts", response_model=PostOut)
def create_club_post(
    club_id: str,
    payload: PostCreate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)]
):
    """Create a new post for a club."""
    verify_club_admin(db, club_id, admin.id)
    club = get_club_by_id(db, club_id)
    return post_service.create_post(db, club, payload)

@router.put("/api/admin/posts/{post_id}", response_model=PostOut)
def update_club_post(
    post_id: str,
    payload: PostUpdate,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)]
):
    """Update an existing post."""
    post = post_service.get_post(db, post_id)
    verify_club_admin(db, post.club_id, admin.id)
    return post_service.update_post(db, post, payload)

@router.delete("/api/admin/posts/{post_id}")
def delete_club_post(
    post_id: str,
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)]
):
    """Delete a post."""
    post = post_service.get_post(db, post_id)
    verify_club_admin(db, post.club_id, admin.id)
    post_service.delete_post(db, post)
    return {"message": "Post deleted successfully"}

from app.schemas.post import PostApproval
from datetime import datetime

@router.patch("/api/posts/{post_id}/approval", response_model=PostOut)
def approve_post(
    post_id: str,
    payload: PostApproval,
    db: Annotated[Session, Depends(get_db)],
    coordinator: Annotated[User, Depends(require_club_coordinator)]
):
    """Approve or reject a post (Coordinator only)."""
    post = post_service.get_post(db, post_id)
    
    # Verify coordinator manages this club
    club = get_club_by_id(db, post.club_id)
    if club.coordinator_id != coordinator.id:
        raise HTTPException(status_code=403, detail="Not authorized to approve for this club")
        
    if payload.approval_status not in ["APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Invalid approval status")
        
    post.approval_status = payload.approval_status
    post.approved_by = coordinator.id
    post.approved_at = datetime.utcnow()
    
    if payload.approval_status == "REJECTED":
        post.rejection_reason = payload.rejection_reason
    else:
        post.rejection_reason = None
        
    db.commit()
    db.refresh(post)
    return post
