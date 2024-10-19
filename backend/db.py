import asyncio
from prisma import Prisma
import os
from dotenv import load_dotenv

from prisma import Prisma
import os
from dotenv import load_dotenv

load_dotenv()

# Define the Prisma client at the module level
database = Prisma()

async def connect_db():
    """Connect to the database."""
    await database.connect()

async def disconnect_db():
    """Disconnect from the database."""
    await database.disconnect()