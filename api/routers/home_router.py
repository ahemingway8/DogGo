from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import RedirectResponse
from utils.authentication import try_get_jwt_user_data

app = FastAPI()

@app.get("/")

async def main_page():
    return {
        "message" : "Discover Dog-Friendly Places Near You!",
        "buttons": [
            {"label": "Find Dog-Friendly Spots!", "action": "/redirect/places"},
            {"label": "Find Events Near You!", "action": "/redirect/events"},
        ],
    }


@app.get("/redirect/{page_name}")
async def redirect_user(page_name: str, user=Depends(try_get_jwt_user_data)):
    if page_name not in ["places", "events"]:
        raise HTTPException(status_code=404, detail="Invalid Page")
    if user:
        return RedirectResponse(url=f"/{"page_name"}")
    else:
        return RedirectResponse(url="/signup")


@app.get("/places")
async def places_page(user=Depends(try_get_jwt_user_data)):
    if not user:
        raise HTTPException(status_code=401, detail="Not authorized")
    return {"message": "Find Dog-Friendly Spots!"}


@app.get("/events")
async def event_page(user=Depends(try_get_jwt_user_data)):
    if not user:
        raise HTTPException(status_code=401, detail="Not Authorized")
    return {"message": "Find Dog-Friendly Events!"}

