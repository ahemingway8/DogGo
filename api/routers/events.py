from fastapi import APIRouter, Depends, Response
from utils.result import Result
from typing import List
from queries.events_queries import (
    EventIn,
    EventRepository,
    EventOut
)

router = APIRouter()

@router.post("/api/events", response_model=Result[EventOut])
def create_event(
    event: EventIn,
    response: Response,
    repo: EventRepository = Depends()
) -> Result[EventOut]:
    return repo.create(event)

@router.get("/api/events", response_model=Result[List[EventOut]])
def get_all(
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    return repo.get_all()

@router.put("/api/events/{event_id}", response_model=Result[EventOut])
def update_event (
    event_id: int,
    event: EventIn,
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    return repo.update(event_id, event)

@router.delete("/api/events/{event_id}", response_model=Result[bool])
def delete_event(
    event_id: int,
    response: Response,
    repo: EventRepository = Depends()
) -> Result[bool]:
    result = repo.delete(event_id)
    if not result.success:
        response.status_code = 404
    return result

@router.get("/api/events/{event_id}", response_model=Result[EventOut])
def get_event_details(
    event_id: int,
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    return repo.get_by_id(event_id)
