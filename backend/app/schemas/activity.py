from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    venue: Optional[str] = None
    link: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    status: str = "UPCOMING"

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    venue: Optional[str] = None
    link: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None

class ActivityOut(ActivityBase):
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

class ActivityApproval(BaseModel):
    status: str  # 'APPROVED' or 'REJECTED'
    rejection_reason: Optional[str] = None
