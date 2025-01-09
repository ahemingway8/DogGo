from fastapi import APIRouter, Depends, Response
from typing import Union
from queries.events_queries import (
    EventIn,
    EventRepository,
    EventOut
)

router = APIRouter()

@router.post("/api/events", response_model=Union [EventOut])
def create_event(
    event: EventIn,
    response: Response,
    repo: EventRepository = Depends()
):
    response.status_code = 400
    return repo.create(event)
