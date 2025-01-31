from fastapi import APIRouter, Depends, Query, Response
from typing import List
from queries.locations_queries import LocationRepository, LocationOut
from utils.result import Result


router = APIRouter()


@router.get("/api/locations", response_model=Result[List[LocationOut]])
def search_pet_friendly_locations(
    response: Response,
    categories: str = Query(
        "pet.shop",
        description="Comma-separated list of categories"
        "(e.g., pet.shop,pet.veterinary)",
    ),
    latitude: float = Query(..., description="Latitude of the location"),
    longitude: float = Query(..., description="Longitude of the location"),
    radius: int = Query(
        5000, description="Search radius in meters (default:5000)"
    ),
    repo: LocationRepository = Depends(),
) -> Result[List[LocationOut]]:
    result = repo.search_locations(categories, latitude, longitude, radius)
    if not result.success:
        if "API key not configured" in str(result.error):
            response.status_code = 500
        elif "Invalid parameters" in str(result.error):
            response.status_code = 400
        else:
            response.status_code = 404
    return result


@router.get("/api/geocode")
async def geocode_address(
    address: str = Query(..., description="Address to geocode"),
    repo: LocationRepository = Depends(),
):
    return repo.geocode_address(address)


@router.get("/api/autocomplete")
async def autocomplete(
    query: str = Query(..., description="Text input for autocomplete"),
    repo: LocationRepository = Depends(),
):
    return repo.autocomplete_address(query)
