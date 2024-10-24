from pydantic import BaseModel
from typing import Optional, List

class User(BaseModel):
    id: Optional[int] = None
    email: str
    artists: list[str]
    city: str
    state: str
    first_name: str
    last_name: str
    profile_url: Optional[str]
    user_id: str

class Review(BaseModel):
    id: Optional[int] = None
    artist: str 
    review: str
    rating: int
    images: Optional[list[str]] = None
    user_id: str