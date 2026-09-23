import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Club(Base):
    __tablename__ = "clubs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), unique=True, nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text)
    category = Column(String(50))
    logo_url = Column(String(500))
    banner_url = Column(String(500))
    admin_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    coordinator_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    admin = relationship("User", foreign_keys=[admin_id], back_populates="clubs_administered")
    coordinator = relationship("User", foreign_keys=[coordinator_id])
    memberships = relationship("ClubMembership", back_populates="club")
    activities = relationship("Activity", back_populates="club")
    announcements = relationship("Announcement", back_populates="club")
