from models import User,Review
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