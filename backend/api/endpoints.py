from fastapi import APIRouter, UploadFile, File, HTTPException
import asyncio
from prisma import Prisma
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from services import insert_user, check_user_in_db, get_all_users,insert_review,check_review_in_db,get_all_reviews,get_average_rating,get_all_reviews_by_user, handle_audio_upload, start_job, get_job_predictions
from models import User,Review


router = APIRouter()

@router.post("/user/add")
async def add_user(user: User):
    print("user", user)
    return await insert_user(user)

@router.get("/user/exists/{email}")
async def check_user_exists(email: str):
    return await check_user_in_db(email)  


@router.get("/user/fetch")
async def fetch_users():
    return await get_all_users()


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
    file_path = await handle_audio_upload(audio_file)
    print("this is the file path", file_path)

    job_id = await start_job(file_path)
    print("this is the job ID", job_id)
    if job_id is not None:
        predictions = await get_job_predictions(job_id)
        #load the predictions and transcript to gemini to correct the transcript and extract a rating based on keywords and emotions
        #extract predictions (text and emotions array)

        rating = await extract_rating(predictions)
        
    else:
        raise HTTPException(status_code=500, detail="Failed to start job")
