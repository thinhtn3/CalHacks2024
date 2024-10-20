from models import User,Review
from db import database
from fastapi import HTTPException, UploadFile, File
import os
from fastapi.responses import JSONResponse, FileResponse
from hume import AsyncHumeClient
from hume.expression_measurement.batch import Prosody, Models
from hume.expression_measurement.batch.types import InferenceBaseRequest
import asyncio
import google.generativeai as genai


genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')



HUME_API_KEY = os.getenv("HUME_API_KEY")  # Or set it directly as a string
client = AsyncHumeClient(api_key=HUME_API_KEY)

UPLOAD_FOLDER = 'uploads'  # Specify your upload folder

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


async def insert_user(user: User) -> User:
    response = await database.user.create(
           data={
               "email": user.email,
               "artists": user.artists,
               "city": user.city,
               "state": user.state,
               "first_name": user.first_name,
               "last_name": user.last_name,
               "profile_url": user.profile_url,
               "user_id" : user.user_id
           })

    print("this is the response", response)
    return response


async def check_user_in_db(email: str) -> bool:
    user = await database.user.find_first(where = {"email": email})
    return user is not None 

async def get_all_users() -> list[User]:
    users = await database.user.find_many()
    return users    


async def insert_review(review: Review) -> Review:
    #makes sure that the user can only do one review per artist 
    check_review = await check_review_in_db(review.artist, review.user_id)
    if check_review:
        raise HTTPException(status_code=400, detail="Review already exists")
    
    response = await database.review.create(
        data = {
            "artist": review.artist,        
            "review": review.review,
            "user_id": review.user_id,
            "rating": review.rating
        }
    )
    return response


async def get_all_reviews(artist: str) -> list[Review]:
    reviews = await database.review.find_many(where = {"artist": artist})
    print(reviews)
    return reviews

async def check_review_in_db(artist: str, user_id: int) -> bool:
    review = await database.review.find_first(where = {"artist": artist, "user_id": user_id})
    return review is not None   

async def get_average_rating(artist: str) -> float:
    reviews = await get_all_reviews(artist)

    if not reviews:
        return 0
    
    total_rating = sum(review.rating for review in reviews)
    return total_rating / len(reviews)

async def get_all_reviews_by_user(user_id: int) -> list[Review]:
    reviews = await database.review.find_many(where = {"user_id": user_id})
    return reviews  




async def handle_audio_upload(file: UploadFile = File(...)):
    if not file:
        return JSONResponse(status_code=400, content={"message": "No file uploaded"})
    
    print(f"Received file: {file.filename}")  # Log the received file name

    # Save the file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
            print(f"File saved to: {file_path}")  # Log the file save location
    except Exception as e:
        print(f"Error saving file: {e}")  # Log the error


    #call hume api here
    
    if file_path is not None:
        return file_path
    else:
        print("error the file path doesnt exist")


async def wait_for_job_completion(client, job_id):
       while True:
           job_status = await client.expression_measurement.batch.get_job_status(id=job_id)
           if job_status['status'] == 'completed':
               return job_status
           elif job_status['status'] == 'failed':
               raise Exception("Job failed")
           await asyncio.sleep(5)  # Wait for 5 seconds before checking again

async def start_job(file_path):
    # Initialize an authenticated client

    # Define the filepath(s) of the file(s) you would like to analyze
    local_filepaths = [open(file_path, mode="rb")]

    prosody_config = Prosody()
    # Create a Models object
    models_chosen = Models(prosody=prosody_config)
    
    # Create a stringified object containing the configuration
    stringified_configs = InferenceBaseRequest(models=models_chosen)

    # Start an inference job and get the job_id
    job_id = await client.expression_measurement.batch.start_inference_job_from_local_file(
        json=stringified_configs, file=local_filepaths
    )

    return job_id

async def get_job_predictions(job_id):
    await asyncio.sleep(5)

    try:
        predictions = await client.expression_measurement.batch.get_job_predictions(
            id=job_id,
        )

        return predictions  # Return the predictions if successful
    except Exception as error:  # Use 'except' instead of 'catch'
        print(error)  # Print the error message
        return None  # Return None or handle the error as needed




async def extract_rating(predictions):
    text = predictions.get("text")
    print(text)
    # response = model.generate_content("Based on this text: ")
