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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
