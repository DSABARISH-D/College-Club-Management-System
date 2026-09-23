from pydantic import BaseModel
from datetime import datetime
from .user import UserOut
from .club import ClubOut

class MembershipOut(BaseModel):
    id: str
    user_id: str
    club_id: str
    joined_at: datetime
    
    # Nested models for detailed views
    user: UserOut | None = None
    club: ClubOut | None = None

    class Config:
        from_attributes = True

class MembershipCreate(BaseModel):
    club_id: str
