from fastapi import APIRouter, Depends, Response, HTTPException, status
from utils.result import Result
from typing import List
from queries.events_queries import EventIn, EventRepository, EventOut
from utils.authentication import try_get_jwt_user_data
from models.jwt import JWTUserData

router = APIRouter()


@router.post("/api/events", response_model=Result[EventOut])
def create_event(
    event: EventIn,
    response: Response,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be logged in to create an event",
        )
    event.created_by = user.id
    return repo.create(event)


@router.get("/api/events", response_model=Result[List[EventOut]])
def get_all(
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    return repo.get_all()


@router.put("/api/events/{event_id}", response_model=Result[EventOut])
def update_event(
    event_id: int,
    event: EventIn,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be logged in to update an event",
        )

    result = repo.update(event_id, event, user.id)
    if not result.success and "Unauthorized" in str(result.error):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=result.error
        )
    return result


@router.delete("/api/events/{event_id}", response_model=Result[bool])
def delete_event(
    event_id: int,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: EventRepository = Depends()
) -> Result[bool]:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be logged in to delete an event",
        )

    print(f"Delete request for event {event_id} by user {user.id}")
    result = repo.delete(event_id, user.id)

    if not result.success:
        if result.error == "unauthorized":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete this event"
            )
        elif result.error == "not_found":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to delete event"
            )

    return result


@router.get("/api/events/{event_id}", response_model=Result[EventOut])
def get_event_details(
    event_id: int,
    repo: EventRepository = Depends(),
) -> Result[EventOut]:
    return repo.get_by_id(event_id)
