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