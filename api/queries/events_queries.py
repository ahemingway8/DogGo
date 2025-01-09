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
    def get_all(self) -> Union[Error, List[EventOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT id, name, description, address, date_time, picture_url
                        FROM events
                        ORDER BY date_time;
                        """
                    )
                    return [
                        EventOut(
                            id=record[0],
                            name=record[1],
                            description=record[2],
                            address=record[3],
                            date_time=record[4],
                            picture_url=record[5],
                        )
                        for record in db
                    ]
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
