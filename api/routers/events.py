from fastapi import APIRouter
from queries.events_queries import EventIn

router = APIRouter()

@router.post("/api/events")
def create_event(event: EventIn):
    print('event', event.name)
    return event
