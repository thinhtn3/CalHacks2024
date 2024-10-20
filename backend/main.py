from fastapi import FastAPI
from api import endpoints
from db import connect_db, disconnect_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


origins = [
    "http://localhost:5174",  # Replace with your frontend's origin
    "http://localhost:3000",
    "http://localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)



@app.on_event("startup")
async def startup_event():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_db()


# Include your API routes
app.include_router(endpoints.router)

