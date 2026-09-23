import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    roll_number = Column(String(20), unique=True, nullable=False)
    department = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False, default="STUDENT") # "STUDENT" or "CLUB_ADMIN"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    clubs_administered = relationship("Club", foreign_keys="[Club.admin_id]", back_populates="admin")
    clubs_coordinated = relationship("Club", foreign_keys="[Club.coordinator_id]", back_populates="coordinator")
    memberships = relationship("ClubMembership", back_populates="user")
