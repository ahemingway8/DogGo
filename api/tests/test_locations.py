from fastapi.testclient import TestClient
from queries.locations_queries import LocationRepository
from main import app
from models.locations import LocationOut
from utils.result import Result
from typing import List

client = TestClient(app)
# Ciera's Tests
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
                        name="Pet Store",
                        address="123 Pet, Anytown",
                        category=["pet.shop"],
                        latitude=45.7128,
                        longitude=-78.0060
                    )
                ]
            )
        return Result(
            success=False,
            error="No locations found for this category"
        )

    def geocode_address(self, address: str) -> Result:
        return Result(
            success=True,
            data={
                "latitude": 40.7128,
                "longitude": -74.0060,
                "address": address
            }
        )

def setup_function():
    app.dependency_overrides[LocationRepository] = FakeLocationRepository

def teardown_function():
    app.dependency_overrides = {}

def test_search_locations_with_valid_category():
    setup_function()
    response = client.get("/api/locations/", params={
        "categories": "pet.shop",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "radius": 5000
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) == 2
    assert data["data"][0]["name"] == "C Pet Store"

def test_search_locations_with_invalid_category():
    setup_function()
    response = client.get("/api/locations/", params={
        "categories": "invalid.category",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "radius": 5000
    })
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
    assert data["error"] == "No locations found for this category"

def test_geocode_address():
    setup_function()
    response = client.get("/api/geocode", params={"address": "123 Main St"})

    assert response.status_code == 200
    data = response.json()
    assert data["data"]["latitude"] == 40.7128
    assert data["data"]["longitude"] == -74.0060
    assert data["data"]["address"] == "123 Main St"
