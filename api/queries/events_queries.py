from typing import List
from utils.result import Result
from models.events import EventIn, EventOut
from queries.pool import pool
from psycopg.rows import class_row


class EventRepository:

    def update(
            self,
            event_id: int,
            event: EventIn,
            user_id: int
    ) -> Result[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    db.execute(
                        """
                        SELECT * FROM events
                        WHERE id = %s AND created_by = %s
                        """,
                        [event_id, user_id]
                    )
                    if db.fetchone() is None:
                        return Result(
                            success=False,
                            error="Unauthorized - Need Permission"
                        )
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
                        WHERE id = %s AND created_by = %s
                        RETURNING *;
                        """,
                        [
                            event.name,
                            event.description,
                            event.address,
                            event.date_time,
                            picture_url,
                            event_id,
                            user_id,
                        ],
                    )
                    updated_event = db.fetchone()
                    if updated_event is None:
                        return Result(
                            success=False,
                            error=f"Event with id {event_id} was not found",
                        )
                    return Result(success=True, data=updated_event)

        except Exception:
            return Result(success=False, error="Event update failed")

    def get_all(self) -> Result[List[EventOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    db.execute(
                        """
                        SELECT
                            id,
                            name,
                            description,
                            address,
                            date_time,
                            picture_url,
                            created_by
                        FROM events
                        ORDER BY date_time;
                        """
                    )
                    return Result(success=True, data=db.fetchall())
        except Exception:
            return Result(success=False, error="Could not get all events")

    def create(self, event: EventIn) -> Result[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    picture_url = (
                        str(event.picture_url) if event.picture_url else None
                    )

                    db.execute(
                        """
                        INSERT INTO events
                            (
                                name,
                                description,
                                address,
                                date_time,
                                picture_url,
                                created_by
                            )
                            VALUES
                                (%s, %s, %s, %s, %s, %s)
                            RETURNING *;
                        """,
                        [
                            event.name,
                            event.description,
                            event.address,
                            event.date_time,
                            picture_url,
                            event.created_by,
                        ],
                    )
                    event = db.fetchone()
                    return Result(success=True, data=event)

        except Exception:
            return Result(success=False, error="Event creation failed")

    def delete(self, event_id: int, user_id: int) -> Result[bool]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:

                    db.execute(
                        """
                        SELECT id, created_by
                        FROM events
                        WHERE id = %s
                        """,
                        [event_id]
                    )
                    event = db.fetchone()

                    if not event:
                        return Result(
                            success=False,
                            error="not_found"
                        )

                    if event[1] != user_id:
                        return Result(
                            success=False,
                            error="unauthorized"
                        )

                    db.execute(
                        """
                        DELETE FROM events
                        WHERE id = %s AND created_by = %s;
                        """,
                        [event_id, user_id]
                    )

                    if db.rowcount == 0:
                        return Result(success=False, error="deletion_failed")

                    return Result(success=True, data=True)

        except Exception:
            return Result(success=False, error="deletion_failed")

    def get_by_id(self, event_id: int) -> Result[EventOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(EventOut)) as db:
                    db.execute(
                        """
                        SELECT id, name, description,
                            address, date_time, picture_url,
                            created_by
                        FROM events
                        Where id =%s;
                        """,
                        [event_id],
                    )
                    event = db.fetchone()
                    if not event:
                        return Result(
                            success=False,
                            error=f"Event with id {event_id} not found",
                        )
                    return Result(success=True, data=event)
        except Exception:
            return Result(success=False, error="Failed to retrieve event")
