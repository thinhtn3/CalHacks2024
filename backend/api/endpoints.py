from fastapi import APIRouter, UploadFile, File, HTTPException
import asyncio
from prisma import Prisma
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from services import insert_user, check_user_in_db, get_all_users,insert_review,check_review_in_db,get_all_reviews,get_average_rating,get_all_reviews_by_user, handle_audio_upload, start_job, get_job_predictions,get_user_info,extract_rating
from models import User,Review


router = APIRouter()

@router.post("/user/add")
async def add_user(user: User):
    print("user", user)
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


@router.get("/retrieve/{user_id}")
async def get_user(user_id: str):
    print("looking for the user info")
    return await get_user_info(user_id)



@router.post("/audio/upload")
async def audio_upload(artist="slander", user_id = "user_8", audio_file: UploadFile = File(...)):
    file_path = await handle_audio_upload(audio_file)
    print("this is the file path", file_path)

    job_id = await start_job(file_path)
    print("this is the job ID", job_id)
    if job_id is not None:
        predictions = await get_job_predictions(job_id)
        #load the predictions and transcript to gemini to correct the transcript and extract a rating based on keywords and emotions
        #extract predictions (text and emotions array)

        review, rating = await extract_rating(predictions)
        print("this is the rating from the audio", rating)
        print("transcript from audio", review)
        int_rating = int(rating)
        print("INT RATING", type(int_rating))
        if isinstance(int_rating, int):  # Ensure int_rating is an integer
            review_instance = Review(artist=artist, review=review, rating=int_rating, user_id=user_id)
            #add to the database for the review 
            res = await insert_review(review_instance)
            if res:
                return review,int_rating
            else:
                return None
    else:
        raise HTTPException(status_code=500, detail="Failed to start job")


