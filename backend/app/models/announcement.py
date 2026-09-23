import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    club_id = Column(String(36), ForeignKey("clubs.id"), index=True, nullable=False)
    title = Column(String(300), nullable=False)
    content = Column(Text, nullable=False)
    link = Column(String(500), nullable=True)
    priority = Column(String(50), nullable=False, default="NORMAL")
    approval_status = Column(String(50), nullable=False, default="APPROVED") # PENDING, APPROVED, REJECTED
    approved_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    club = relationship("Club", back_populates="announcements")
    approver = relationship("User", foreign_keys=[approved_by])
