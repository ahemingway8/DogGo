from fastapi import APIRouter, Depends, Response
from typing import Union, List
from queries.events_queries import (
    Error,
    EventIn,
    EventRepository,
    EventOut
)

router = APIRouter()

@router.post("/api/events", response_model=Union [EventOut, Error])
def create_event(
    event: EventIn,
    response: Response,
    repo: EventRepository = Depends()
):
    return repo.create(event)

@router.get("/api/events", response_model=Union [List[EventOut], Error])
def get_all(
    repo: EventRepository = Depends(),
):
    return repo.get_all()

@router.put("/api/events/{event_id}", response_model=Union[EventOut, Error])
def update_event (
    event_id: int,
    event: EventIn,
    repo: EventRepository = Depends(),
) -> Union[Error, EventOut]:
    return repo.update(event_id, event)
