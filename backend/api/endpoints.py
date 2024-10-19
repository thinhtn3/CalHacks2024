from fastapi import APIRouter
import asyncio
from prisma import Prisma
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from services import insert_user, check_user_in_db, get_all_users
from models import User

router = APIRouter()

@router.post("/user/add")
async def add_user(user: User):
    return await insert_user(user)



@router.get("/user/exists/{email}")
async def check_user_exists(email: str):
    return await check_user_in_db(email)  


@router.get("/user/fetch")
async def fetch_users():
    return await get_all_users()


