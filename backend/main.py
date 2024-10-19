from fastapi import FastAPI
from api import endpoints
from db import connect_db, disconnect_db
app = FastAPI()

@app.on_event("startup")
async def startup_event():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_event():
    await disconnect_db()


# Include your API routes
app.include_router(endpoints.router)

