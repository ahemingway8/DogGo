from pydantic import BaseModel, HttpUrl
from typing import Optional, Union
from datetime import datetime
from queries.pool import pool
from psycopg.rows import class_row


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
    def create(self, event: EventIn) -> EventOut:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
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
                            event.picture_url
                        ]
                    )
                    event = db.fetchone()
                    return event

        except Exception as e:
            return {"message": "Event creation failed"}
