from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from seed_data import CATEGORIES, EVENT_TYPES, VENDORS, IDEAS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Ayojan Wale API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class Requirement(BaseModel):
    category_slug: str
    category_name: str
    notes: Optional[str] = ""


class EventCreate(BaseModel):
    name: str
    event_type: str
    date: Optional[str] = ""
    city: Optional[str] = ""
    guest_count: Optional[str] = ""
    budget: Optional[str] = ""
    requirements: List[Requirement] = []


class Event(EventCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class Lead(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vendor_id: str
    name: str
    phone: str
    message: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    vendor_id: str
    name: str
    phone: str
    message: Optional[str] = ""


# ---------- Seeding ----------
async def seed():
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many([{**c} for c in CATEGORIES])
    if await db.event_types.count_documents({}) == 0:
        await db.event_types.insert_many([{**e} for e in EVENT_TYPES])
    if await db.vendors.count_documents({}) == 0:
        await db.vendors.insert_many([{**v} for v in VENDORS])
    if await db.ideas.count_documents({}) == 0:
        await db.ideas.insert_many([{**i} for i in IDEAS])


@app.on_event("startup")
async def on_startup():
    await seed()


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Ayojan Wale API"}


@api_router.get("/categories")
async def get_categories():
    return await db.categories.find({}, {"_id": 0}).to_list(100)


@api_router.get("/event-types")
async def get_event_types():
    return await db.event_types.find({}, {"_id": 0}).to_list(100)


@api_router.get("/ideas")
async def get_ideas():
    return await db.ideas.find({}, {"_id": 0}).to_list(100)


@api_router.get("/vendors")
async def get_vendors(
    category: Optional[str] = None,
    event_type: Optional[str] = None,
    city: Optional[str] = None,
    q: Optional[str] = None,
):
    query = {}
    if category:
        query["category_slug"] = category
    if event_type:
        query["event_types"] = event_type
    if city:
        query["city"] = city
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    return await db.vendors.find(query, {"_id": 0}).to_list(200)


@api_router.get("/vendors/cities")
async def get_cities():
    return await db.vendors.distinct("city")


@api_router.get("/vendors/{vendor_id}")
async def get_vendor(vendor_id: str):
    vendor = await db.vendors.find_one({"id": vendor_id}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor


@api_router.post("/events", response_model=Event)
async def create_event(payload: EventCreate):
    event = Event(**payload.model_dump())
    await db.events.insert_one(event.model_dump())
    return event


@api_router.get("/events/{event_id}", response_model=Event)
async def get_event(event_id: str):
    doc = await db.events.find_one({"id": event_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Event not found")
    return Event(**doc)


@api_router.post("/leads")
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    return {"ok": True, "id": lead.id}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
