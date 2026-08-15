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
from datetime import datetime, timezone, timedelta, date

from seed_data import CATEGORIES, EVENT_TYPES, VENDORS, IDEAS

BOOKING_STATUSES = ["pending", "confirmed", "in_progress", "completed", "cancelled"]
ACTIVE_STATUSES = ["pending", "confirmed", "in_progress"]

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


class StatusEntry(BaseModel):
    status: str
    at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    note: Optional[str] = ""


class BookingCreate(BaseModel):
    vendor_id: str
    package_name: str
    package_price: int
    event_date: str  # YYYY-MM-DD
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = ""
    event_type: Optional[str] = ""
    notes: Optional[str] = ""


class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    ref: str = Field(default_factory=lambda: "AW-" + uuid.uuid4().hex[:6].upper())
    vendor_id: str
    vendor_name: str = ""
    vendor_image: str = ""
    category_name: str = ""
    city: str = ""
    package_name: str
    package_price: int
    event_date: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = ""
    event_type: Optional[str] = ""
    notes: Optional[str] = ""
    status: str = "pending"
    status_history: List[StatusEntry] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class StatusUpdate(BaseModel):
    status: str
    note: Optional[str] = ""


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
    if await db.vendor_availability.count_documents({}) == 0:
        today = datetime.now(timezone.utc).date()
        docs = []
        for i, v in enumerate(VENDORS):
            offsets = [7 + i % 5, 15 + i % 7, 24 + i % 6, 33 + i % 9]
            dates = [(today + timedelta(days=o)).isoformat() for o in offsets]
            docs.append({"vendor_id": v["id"], "blackout_dates": dates})
        await db.vendor_availability.insert_many(docs)
    if await db.bookings.count_documents({}) == 0:
        today = datetime.now(timezone.utc).date()

        def demo(vid, pkg, price, days, status, hist, name="Demo Planner", phone="9000000000", etype=""):
            now = datetime.now(timezone.utc)
            history = [
                {"status": s, "at": (now - timedelta(days=d)).isoformat(), "note": n}
                for s, d, n in hist
            ]
            v = next((x for x in VENDORS if x["id"] == vid), {})
            return {
                "id": str(uuid.uuid4()),
                "ref": "AW-" + uuid.uuid4().hex[:6].upper(),
                "vendor_id": vid,
                "vendor_name": v.get("name", ""),
                "vendor_image": v.get("image", ""),
                "category_name": v.get("category_name", ""),
                "city": v.get("city", ""),
                "package_name": pkg,
                "package_price": price,
                "event_date": (today + timedelta(days=days)).isoformat(),
                "customer_name": name,
                "customer_phone": phone,
                "customer_email": "",
                "event_type": etype,
                "notes": "",
                "status": status,
                "status_history": history,
                "created_at": (now - timedelta(days=hist[0][1])).isoformat(),
            }

        await db.bookings.insert_many([
            demo("v1", "Full Wedding", 45000, 40, "confirmed",
                 [("pending", 6, "Request sent"), ("confirmed", 4, "Vendor accepted your booking")], etype="wedding"),
            demo("v2", "Full Venue", 90000, 18, "in_progress",
                 [("pending", 10, "Request sent"), ("confirmed", 8, "Vendor accepted"), ("in_progress", 2, "Setup planning underway")], etype="wedding"),
            demo("v5", "Bridal Package", 35000, -12, "completed",
                 [("pending", 30, "Request sent"), ("confirmed", 28, "Vendor accepted"), ("in_progress", 14, "Work in progress"), ("completed", 11, "Event delivered successfully")], etype="wedding"),
        ])


async def unavailable_dates(vendor_id: str):
    doc = await db.vendor_availability.find_one({"vendor_id": vendor_id}, {"_id": 0})
    blackout = set(doc["blackout_dates"]) if doc else set()
    booked = await db.bookings.find(
        {"vendor_id": vendor_id, "status": {"$in": ACTIVE_STATUSES}}, {"_id": 0, "event_date": 1}
    ).to_list(500)
    for b in booked:
        blackout.add(b["event_date"])
    return sorted(blackout)


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


# ---------- Bookings & availability ----------
@api_router.get("/vendors/{vendor_id}/availability")
async def vendor_availability(vendor_id: str):
    vendor = await db.vendors.find_one({"id": vendor_id}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return {"unavailable_dates": await unavailable_dates(vendor_id)}


@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    vendor = await db.vendors.find_one({"id": payload.vendor_id}, {"_id": 0})
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    try:
        chosen = date.fromisoformat(payload.event_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date")
    if chosen < datetime.now(timezone.utc).date():
        raise HTTPException(status_code=400, detail="Event date cannot be in the past")
    if payload.event_date in await unavailable_dates(payload.vendor_id):
        raise HTTPException(status_code=409, detail="This date is no longer available")

    booking = Booking(
        vendor_name=vendor.get("name", ""),
        vendor_image=vendor.get("image", ""),
        category_name=vendor.get("category_name", ""),
        city=vendor.get("city", ""),
        status="pending",
        status_history=[StatusEntry(status="pending", note="Booking requested")],
        **payload.model_dump(),
    )
    await db.bookings.insert_one(booking.model_dump())
    return booking


@api_router.get("/bookings")
async def list_bookings(phone: Optional[str] = None, ids: Optional[str] = None):
    query = {}
    if phone:
        query["customer_phone"] = phone
    if ids:
        query["id"] = {"$in": [i for i in ids.split(",") if i]}
    if not query:
        return []
    docs = await db.bookings.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return docs


@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**doc)


@api_router.patch("/bookings/{booking_id}/status", response_model=Booking)
async def update_booking_status(booking_id: str, payload: StatusUpdate):
    if payload.status not in BOOKING_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Booking not found")
    entry = StatusEntry(status=payload.status, note=payload.note or "").model_dump()
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": payload.status}, "$push": {"status_history": entry}},
    )
    doc = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    return Booking(**doc)


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
