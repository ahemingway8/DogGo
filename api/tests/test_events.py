from fastapi.testclient import TestClient
from main import app
from queries.events_queries import EventRepository
from utils.authentication import try_get_jwt_user_data
from models.jwt import JWTUserData
from utils.result import Result
from models.events import EventOut

client = TestClient(app)

class FakeEventRepository:
    def create(self, event) -> Result[EventOut]:
        return Result(
            success=True,
            data=EventOut(
                id=1,
                name=event.name,
                description=event.description,
                address=event.address,
                date_time=event.date_time,
                picture_url=event.picture_url,
                created_by=123
            )
        )
# April's tests
    def delete(self, event_id: int, user_id: int) -> Result[bool]:
        if event_id == 1:
            return Result(success=True, data=True)
        return Result(success=False, error="not_found")

async def override_auth():
    return JWTUserData(id=1, username="test_user")

def test_create_event_unauthorized():
    app.dependency_overrides = {}

    response = client.post("/api/events", json={
        "name": "Test Event",
        "description": "Test Description",
        "address": "123 Test Street",
        "date_time": "2024-02-15T10:00:00",
        "picture_url": None
    })

    assert response.status_code == 401
    assert "logged in" in response.json()["detail"]

def test_create_event_success():
    app.dependency_overrides[EventRepository] = FakeEventRepository
    app.dependency_overrides[try_get_jwt_user_data] = override_auth

    event_data = {
        "name": "New Event",
        "description": "Event description",
        "address": "456 Event Street",
        "date_time": "2024-02-15T10:00:00",
        "picture_url": None
    }

    response = client.post("/api/events", json=event_data)

    assert response.status_code == 200
    result = response.json()
    assert result["data"]["name"] == event_data["name"]
    assert result["data"]["created_by"] == 123

# Hayden's Tests
def test_delete_event_success():
    app.dependency_overrides[EventRepository] = FakeEventRepository
    app.dependency_overrides[try_get_jwt_user_data] = override_auth

    response = client.delete("/api/events/1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"] is True

def test_delete_event_not_found():
    app.dependency_overrides[EventRepository] = FakeEventRepository
    app.dependency_overrides[try_get_jwt_user_data] = override_auth

    response = client.delete("/api/events/999")
    assert response.status_code == 404
    data = response.json()
    assert "Event not found" in data["detail"]
