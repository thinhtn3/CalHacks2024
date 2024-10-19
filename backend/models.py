from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[int] = None
    fisrtName: str
    lastName: str
    email: str
    artists: list[str]
    genres: list[str]
    city: str
    state: str

class Review(BaseModel):
    id: Optional[int] = None
    artist: str 
    review: str
    firstName: str
    lastName: str
    rating: int
   