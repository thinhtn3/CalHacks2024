from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    age: int
    gender: str
    artists: list[str]
    genres: list[str]
    city: str
    state: str

class Review(BaseModel):
    id: Optional[int] = None
    artist: str 
    review: str
    user_id: int
    rating: int
   