from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class AnnouncementBase(BaseModel):
    title: str
    content: str
    link: Optional[str] = None
    priority: str = "NORMAL"

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    link: Optional[str] = None
    priority: Optional[str] = None

class AnnouncementOut(AnnouncementBase):
    id: str
    club_id: str
    created_at: datetime
    updated_at: datetime
    approval_status: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None

    class Config:
        from_attributes = True

class AnnouncementApproval(BaseModel):
    status: str  # 'APPROVED' or 'REJECTED'
    rejection_reason: Optional[str] = None
