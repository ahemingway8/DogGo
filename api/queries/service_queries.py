from typing import List
from utils.result import Result
from models.services import ServiceIn, ServiceOut, ReviewIn, ReviewOut
from queries.pool import pool
from psycopg.rows import class_row


class ServiceRepository:
    def update(
            self,
            service_id: int,
            service: ServiceIn,
            user_id: int
    ) -> Result[ServiceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        "SELECT created_by FROM services WHERE id = %s",
                        [service_id]
                    )
                    result = db.fetchone()
                    if not result:
                        return Result(success=False, error="Service not found")
                    if result[0] != user_id:
                        return Result(success=False, error="Unauthorized")

                with conn.cursor(row_factory=class_row(ServiceOut)) as db:
                    picture_url = None
                    if service.picture_url:
                        picture_url = str(service.picture_url)

                    db.execute(
                        """
                        UPDATE services
                        SET name = %s,
                            description = %s,
                            price = %s,
                            location = %s,
                            contact = %s,
                            picture_url = %s
                        WHERE id = %s
                        AND created_by = %s
                        RETURNING *;
                        """,
                        [
                            service.name,
                            service.description,
                            service.price,
                            service.location,
                            service.contact,
                            picture_url,
                            service_id,
                            user_id
                        ]
                    )
                    updated_service = db.fetchone()
                    if not updated_service:
                        return Result(
                            success=False,
                            error="Service update failed"
                        )
                    return Result(success=True, data=updated_service)
        except Exception as e:
            return Result(success=False, error=str(e))

    def create(self, service: ServiceIn) -> Result[ServiceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ServiceOut)) as db:
                    picture_url = None
                    if service.picture_url:
                        picture_url = str(service.picture_url)

                    db.execute(
                        """
                        INSERT INTO services (name, description,
                        price, location, contact, picture_url, created_by)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        RETURNING *;
                        """,
                        [
                            service.name,
                            service.description,
                            service.price,
                            service.location,
                            service.contact,
                            picture_url,
                            service.created_by
                        ]
                    )
                    created_service = db.fetchone()
                    return Result(success=True, data=created_service)
        except Exception as e:
            return Result(success=False, error=str(e))

    def get_all(self) -> Result[List[ServiceOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ServiceOut)) as db:
                    db.execute("SELECT * FROM services")
                    return Result(success=True, data=db.fetchall())
        except Exception as e:
            return Result(success=False, error=str(e))

    def get_by_id(self, service_id: int) -> Result[ServiceOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ServiceOut)) as db:
                    db.execute(
                        "SELECT * FROM services WHERE id = %s",
                        [service_id]
                    )
                    service = db.fetchone()
                    if not service:
                        return Result(success=False, error="Service not found")
                    return Result(success=True, data=service)
        except Exception as e:
            return Result(success=False, error=str(e))

    def delete(self, service_id: int, user_id: int) -> Result[bool]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        "SELECT id,created_by FROM services WHERE id = %s",
                        [service_id]
                    )
                    service = db.fetchone()

                    if not service:
                        return Result(success=False, error="Service not found")

                    if service[1] != user_id:
                        return Result(success=False, error="Unauthorized")

                    db.execute(
                        """
                        DELETE FROM services
                        WHERE id = %s
                        AND created_by = %s
                        """,
                        [service_id, user_id]
                    )
                    if db.rowcount == 0:
                        return Result(success=False,
                                      error="Service deletion failed")

                    return Result(success=True, data=True)
        except Exception as e:
            return Result(success=False, error=str(e))

    def create_review(self, review: ReviewIn) -> Result[ReviewOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ReviewOut)) as db:
                    db.execute(
                        """
                        INSERT INTO reviews (rating, comment,
                        service_id, created_by)
                        VALUES (%s, %s, %s, %s)
                        RETURNING *;
                        """,
                        [review.rating, review.comment, review.service_id,
                         review.created_by]
                    )
                    created_review = db.fetchone()
                    return Result(success=True, data=created_review)
        except Exception as e:
            return Result(success=False, error=str(e))

    def get_reviews(self, service_id: int) -> Result[List[ReviewOut]]:
        try:
            with pool.connection() as conn:
                with conn.cursor(row_factory=class_row(ReviewOut)) as db:
                    db.execute("SELECT * FROM reviews WHERE service_id = %s",
                               [service_id])
                    return Result(success=True, data=db.fetchall())
        except Exception as e:
            return Result(success=False, error=str(e))
