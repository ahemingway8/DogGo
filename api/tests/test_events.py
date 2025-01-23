from fastapi.testclient import TestClient
from main import app
from queries.events_queries import EventRepository
from datetime import datetime

client = TestClient(app)

class EmptyEventRepository:
    def create(self, event):
        return {
            "data": {
                "id": 1,
                "name": event.name,
                "description": event.description,
                "address": event.address,
                "date_time": event.date_time,
                "picture_url": event.picture_url,
                "created_by": 123
            }
        }

    def test_create_event_unauthorized():

        app.dependency_overrides[EventRepository] = lambda: None

        response = client.post("/api/events", json={
            "name": "Test Event",
            "description": "Test Description",
            "address": "123 Test Street",
            "date_time": "2024-02-15T10:00:00"
        })

        app.dependency_overrides = {}

        assert response.status_code == 401
        assert "logged in" in response.json()["detail"]

    def test_create_event_success():

        app.dependency_overrides[EventRepository] = EmptyEventRepository

        event_data = {
            "name": "New Event",
            "description": "Event description",
            "address": "456 Event Street",
            "date_time": "2024-02-15T10:00:00",
            "picture_url": ""
        }

        response = client.post("/api/events", json=event_data)

        app.dependency_overrides = {}

        assert response.status_code == 200
        result = response.json()
        assert result["data"]["name"] == event_data["name"]
        assert result["data"]["created_by"] == 123
