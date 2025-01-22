from fastapi.testclient import TestClient
from main import app
from queries.locations_queries import LocationRepository
from models.locations import LocationOut
from utils.result import Result
from typing import List

client = TestClient(app)

class FakeLocationRepository:
    def search_locations(
            self,
            categories: str,
            latitude: float,
            longitude: float,
            radius: int = 5000,

    ) -> Result[List[LocationOut]]:
        if categories == "pet.shop":
            return Result(
                success=True,
                data=[
                    LocationOut(
                        name="C Pet Store",
                        address="123 Pet Stop, Anytown",
                        category=["pet.shop"],
                        latitude=40.7128,
                        longitude=-74.0060
                    ),
                    LocationOut(
                        name=" Pet Store",
                        address="123 Pet, Anytown",
                        category=["pet.shop"],
                        latitude=45.7128,
                        longitude=-78.0060
                    )
                ],
                error=None
            )
        elif not categories:
            return Result(
                success=False,
                data=None,
                error="No locations found"
            )
