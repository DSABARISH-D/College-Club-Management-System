from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from .user import UserOut

class ClubBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    category: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None

class ClubCreate(ClubBase):
    pass

class ClubUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None

class ClubOut(ClubBase):
    id: str
    admin_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True
