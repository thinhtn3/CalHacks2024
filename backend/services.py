from models import User
from db import database
from fastapi import HTTPException


async def insert_user(user: User) -> User:
    existing_user = await check_user_in_db(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    response = await database.user.create(
        data ={
            "name" : user.name,
            "email": user.email,
            "age": user.age,
            "gender": user.gender,
            "artists": user.artists,
            "genres": user.genres,
            "city": user.city,
            "state": user.state
        })

    print("this is the response", response)
    return response


async def check_user_in_db(email: str) -> bool:
    user = await database.user.find_first(where = {"email": email})
    return user is not None 

async def get_all_users() -> list[User]:
    users = await database.user.find_many()
    return users    