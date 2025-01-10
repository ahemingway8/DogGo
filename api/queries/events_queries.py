from pydantic import BaseModel, HttpUrl
from typing import Optional, Union, List
from datetime import datetime
from queries.pool import pool
from psycopg.rows import class_row

class Error(BaseModel):
    message: str

class EventIn(BaseModel):
    name: str
    description: str
    address: str
    date_time: datetime
    picture_url: Optional[HttpUrl]

class EventOut(BaseModel):
    id: int
    name: str
    description: str
    address: str
    date_time: datetime
    picture_url: Optional[HttpUrl]


class EventRepository:

    def update(self, event_id: int, event: EventIn) -> Union[EventOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    picture_url = str(event.picture_url) if event.picture_url else None
                    db.execute(
                        """
                        UPDATE events
                        SET name = %s
                            , description = %s
                            , address = %s
                            , date_time = %s
                            , picture_url = %s
                        WHERE id = %s
                        RETURNING *;
                        """,
                        [
                            event.name,
                            event.description,
                            event.address,
                            event.date_time,
                            picture_url,
                            event_id
                        ]
                    )
                    updated_event = db.fetchone()
                    if updated_event is None:
                        return Error(message=f"Event with id {event_id} not found")
                    return updated_event

        except Exception as e:
            print(e)
            return Error(message="Event update failed")


    def get_all(self) -> Union[Error, List[EventOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    result = db.execute(
                        """
                        SELECT id, name, description, address, date_time, picture_url
                        FROM events
                        ORDER BY date_time;
                        """
                    )
                    return db.fetchall()
        except Exception as error:
            print(error)
            return {"message": "Could not get all events"}

    def create(self, event: EventIn) -> Union[Error, EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    picture_url = str(event.picture_url) if event.picture_url else None

                    result = db.execute(
                        """
                        INSERT INTO events
                            (name, description, address, date_time, picture_url)
                            VALUES
                                (%s, %s, %s, %s, %s)
                            RETURNING *;
                        """,
                        [
                            event.name,
                            event.description,
                            event.address,
                            event.date_time,
                            picture_url
                        ]
                    )
                    event = db.fetchone()
                    return event

        except Exception as e:
            print(e)
            return Error(message="Event creation failed")

    def delete(self, event_id: int) -> Union[bool, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    db.execute(
                        """
                        DELETE FROM events
                        WHERE id = %s;
                        """,
                        [event_id]
                    )
                    if db.rowcount == 0:
                        return Error(message="Event not found or could not be deleted")
                    return True
        except Exception as e:
            print(e)
            return Error(message="Could not delete the event")
