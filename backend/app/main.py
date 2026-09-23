"""
BIT Clubs & Communities — FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, clubs, memberships, activities, announcements, coordinator, coordinator_clubs, analytics, posts

# Import all models so Base.metadata is populated
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(application: FastAPI):
    """Create database tables on startup (dev convenience)."""
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="BIT Clubs & Communities",
    description="Discover. Connect. Participate. — College Club Management System for BIT.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server to talk to this API
# ---------------------------------------------------------------------------
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Register routers
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(clubs.router)
app.include_router(memberships.router)
app.include_router(activities.router)
app.include_router(announcements.router)
app.include_router(coordinator.router)
app.include_router(coordinator_clubs.router)
app.include_router(analytics.router)
app.include_router(posts.router)

# ---------------------------------------------------------------------------
# Admin dashboard stats endpoint
# ---------------------------------------------------------------------------
from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.dependencies import get_db, require_admin
from app.models.user import User
from app.models.club import Club
from app.models.membership import ClubMembership
from app.models.activity import Activity
from app.models.announcement import Announcement


@app.get("/api/admin/dashboard", tags=["Admin"])
def admin_dashboard(
    db: Annotated[Session, Depends(get_db)],
    admin: Annotated[User, Depends(require_admin)],
):
    """Return aggregated stats for the admin's club."""
    club = db.query(Club).filter(Club.admin_id == admin.id).first()
    if not club:
        return {
            "club": None,
            "member_count": 0,
            "activity_count": 0,
            "announcement_count": 0,
            "recent_members": [],
        }

    member_count = (
        db.query(func.count(ClubMembership.id))
        .filter(ClubMembership.club_id == club.id)
        .scalar()
    )
    activity_count = (
        db.query(func.count(Activity.id))
        .filter(Activity.club_id == club.id)
        .scalar()
    )
    announcement_count = (
        db.query(func.count(Announcement.id))
        .filter(Announcement.club_id == club.id)
        .scalar()
    )

    # Recent 5 members
    recent_memberships = (
        db.query(ClubMembership)
        .filter(ClubMembership.club_id == club.id)
        .order_by(ClubMembership.joined_at.desc())
        .limit(5)
        .all()
    )
    recent_members = []
    for m in recent_memberships:
        user = db.query(User).filter(User.id == m.user_id).first()
        if user:
            recent_members.append({
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "department": user.department,
                "joined_at": m.joined_at.isoformat() if m.joined_at else None,
            })

    return {
        "club": {
            "id": club.id,
            "name": club.name,
            "slug": club.slug,
            "category": club.category,
        },
        "member_count": member_count,
        "activity_count": activity_count,
        "announcement_count": announcement_count,
        "recent_members": recent_members,
    }


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health", tags=["System"])
def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "BIT Clubs & Communities API"}
