from fastapi import APIRouter, HTTPException
import requests


router = APIRouter()


DOG_API_URL = "http://dog-api.kinduff.com/api/facts"

@router.get("/")
async def main_page():
    return {
        "message": "Discover Dog-Friendly Places Near You!",
        "buttons": [
            {"label": "Find Dog-Friendly Spots!",
                "action": "/redirect/places"},
            {"label": "Find Events Near You!",
                "action": "/redirect/events"},
        ],
    }


@router.get("/redirect/{page_name}")
async def redirect_user(page_name: str ):
    if page_name not in ["places", "events"]:
        raise HTTPException(status_code=404, detail="Invalid Page")
    return {"message": f"Redirecting to {page_name}"}



@router.get("/places")
async def places_page():
    return {"message": "Find Dog-Friendly Spots!"}


@router.get("/events")
async def event_page():
    return {"message": "Find Dog-Friendly Events!"}


@router.get("/api/dog-facts")
async def get_dog_facts():
    try:
        response = requests.get(DOG_API_URL)
        response.raise_for_status()
        data = response.json()

        if "facts" not in data:
            raise HTTPException(status_code=500, detail="Invalid response from API")
        return {"facts": data["facts"]}

    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Error fetching dog facts")
