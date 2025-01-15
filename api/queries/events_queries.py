from typing import List
from utils.result import Result
from models.events import EventIn, EventOut
from queries.pool import pool
from psycopg.rows import class_row


class EventRepository:

    def update(self, event_id: int, event: EventIn) -> Result[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    picture_url = (
                        str(event.picture_url) if event.picture_url else None
                    )
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
                            event_id,
                        ],
                    )
                    updated_event = db.fetchone()
                    if updated_event is None:
                        return Result(
                            success=False,
                            error=f"Event with id {event_id} was not found",
                        )
                    return Result(success=True, data=updated_event)

        except Exception as e:
            print(e)
            return Result(success=False, error="Event update failed")

    def get_all(self) -> Result[List[EventOut]]:
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
                    return Result(success=True, data=db.fetchall())
        except Exception as error:
            print(error)
            return Result(success=False, error="Could not get all events")

    def create(self, event: EventIn) -> Result[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    picture_url = (
                        str(event.picture_url) if event.picture_url else None
                    )

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
                            picture_url,
                        ],
                    )
                    event = db.fetchone()
                    return Result(success=True, data=event)

        except Exception as e:
            print(e)
            return Result(success=False, error="Event creation failed")

    def delete(self, event_id: int) -> Result[bool]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    db.execute(
                        """
                        DELETE FROM events
                        WHERE id = %s;
                        """,
                        [event_id],
                    )
                    if db.rowcount == 0:
                        return Result(
                            success=False,
                            error="Event not found or could not be deleted",
                        )
                    return Result(success=True, data=True)
        except Exception as e:
            print(e)
            return Result(success=False, error="Could not delete the event")

    def get_by_id(self, event_id: int) -> Result[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    result = db.execute(
                        """
                        SELECT id, name, description, address, date_time, picture_url
                        FROM events
                        Where id =%s;
                        """,
                        [event_id],
                    )
                    event = db.fetchnone()
                    if not event:
                        return Result(
                            success=False,
                            error=f"Event with id {event_id} not found",
                        )
                    return Result(success=True, data=event)
        except Exception as e:
            print(e)
            return Result(success=False, error="Failed to retrieve event")
