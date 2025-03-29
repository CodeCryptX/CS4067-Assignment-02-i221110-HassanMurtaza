from fastapi import FastAPI
from db_connection import db  # Import the database directly instead of get_db
from dotenv import load_dotenv
import os

app = FastAPI()
load_dotenv()

@app.get("/events")
async def get_events():
    events = list(db.events.find({}, {'_id': 0}))
    return {"events": events}

@app.get("/events/{event_id}/availability")
async def check_availability(event_id: str):
    event = db.events.find_one({"id": event_id})
    return {"available_tickets": event["capacity"] - event["booked"]}

@app.post("/events")
async def create_event(name: str, date: str, location: str, capacity: int):
    """
    Create a new event.
    """
    # Generate a unique ID for the event (you can use a library like `uuid` for better IDs)
    event_id = str(db.events.count_documents({}) + 1)

    # Create the event document
    event = {
        "id": event_id,
        "name": name,
        "date": date,
        "location": location,
        "capacity": capacity,
        "booked": 0  # Initialize booked tickets to 0
    }

    # Insert the event into the database
    db.events.insert_one(event)

    return {"message": "Event created", "event_id": event_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
