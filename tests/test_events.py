from fastapi.testclient import TestClient
from api.models.events import EventOut
from api.utils.result import Result
from api.queries.events_queries import EventRepository
from api.main import app

client = TestClient(app)

class FakeEventRepository:
    def delete(
        self,
        event_id: int,
    ) -> Result[bool]:
        if event_id == 1:
            return Result(
                success=True,
                data=True
            )
        elif event_id == 999:
            return Result(
                success=False,
                error="Event not found or could not be deleted"
            )
        else:
            return Result(
                success=False,
                error="Could not delete the event"
            )

def test_delete_event():
    # Arrange
    app.dependency_overrides[EventRepository] = FakeEventRepository

    # Act
    response = client.delete("/api/events/1")

    # Assert
    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "data": True,
        "error": None
    }
    # Clean up
    app.dependency_overrides = {}
