from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class PostBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    image_url: Optional[str] = None

class PostOut(PostBase):
    id: str
    club_id: str
    approval_status: str
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PostApproval(BaseModel):
    approval_status: str  # APPROVED or REJECTED
    rejection_reason: Optional[str] = None
