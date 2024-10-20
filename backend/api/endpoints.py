from fastapi import APIRouter, UploadFile, File
import asyncio
from prisma import Prisma
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from services import insert_user, check_user_in_db, get_all_users,insert_review,check_review_in_db,get_all_reviews,get_average_rating,get_all_reviews_by_user, handle_audio_upload, fetch_user_firstName
from core.ranking import recommendaditon
from models import User,Review

router = APIRouter()

@router.post("/user/add")
async def add_user(user: User):
    return await insert_user(user)

@router.get("/user/exists/{email}")
async def check_user_exists(email: str):
    return await check_user_in_db(email)  

#create an api that returns the user's information based on first and last name from the db
@router.get("/user/fetch/{firstName}")
async def fetch_users_firstName(firstName: str):
    return await fetch_user_firstName(firstName)  

@router.get("/user/fetch")
async def fetch_users():
    return await get_all_users()

@router.get("/user/fetch/recommend")
async def fetch_recommend():
    print("yyfhfhgf")
    res = await recommendaditon()
    print(res)

@router.post("/review/add")
async def add_review(review: Review):
    return await insert_review(review)


@router.get("/review/exists/{artist}/{user_id}")
async def check_review_exists(artist: str, user_id: int):
    return await check_review_in_db(artist, user_id)    


@router.get("/review/fetch/{artist}")
async def fetch_reviews(artist: str):
    return await get_all_reviews(artist)

@router.get("/review/average/{artist}")
async def get_average_rating(artist: str):
    return await get_average_rating(artist)

@router.get("/review/user/{user_id}")
async def get_reviews_by_user(user_id: int):
    return await get_all_reviews_by_user(user_id)


@router.post("/audio/upload")
async def audio_upload(audio_file: UploadFile = File(...)):
    return await handle_audio_upload(audio_file)


