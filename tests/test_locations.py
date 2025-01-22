from fastapi.testclient import TestClient
from api.main import app
from api.queries.locations_queries import LocationRepository
from api.models.locations import LocationOut
from api.utils.result import Result
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

app.dependency_overrides[LocationRepository] = FakeLocationRepository

#Test Cases
def test_search_locations_with_valid_category():
    response = client.get("/locations/search", params={
        "categories": "pet.shop",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "radius": 5000
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 2
    assert data['data'][0]["name"] == "C Pet Store"
