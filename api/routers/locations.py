from fastapi import APIRouter, Depends, Query, Response
from typing import List
from queries.locations_queries import LocationRepository, LocationOut
from utils.result import Result
from os import getenv
import requests


router = APIRouter()

GEOAPIFY_API_KEY = getenv("GEOAPIFY_API_KEY")


@router.get("/api/search-places", response_model=Result[List[LocationOut]])
def search_places_by_address(
    response: Response,
    address: str = Query(
        ..., description="The address to search nearby pet-friendly locations."
    ),
    categories: str = Query(
        "pet.shop,pet.veterinary,pet.service",
        description="Comma-separated list of categories (e.g.,pet.shop,pet.veterinary,pet.service)",
    ),
    radius: int = Query(
        5000, description="Search radius in meters (default: 5000)"
    ),
    repo: LocationRepository = Depends(),
) -> Result[List[LocationOut]]:
    """
    Search for pet-friendly locations near a specific address.
    """
    if not GEOAPIFY_API_KEY:
        response.status_code = 500
        return Result(
            success=False, data=None, error="Geoapify API key not configured"
        )
    geocode_url = f"https://api.geoapify.com/v1/geocode/search?text={address}&filter=countrycode:us&apiKey={GEOAPIFY_API_KEY}"

    try:
        geocode_response = requests.get(geocode_url)
        geocode_response.raise_for_status()
        geocode_data = geocode_response.json()

        if not geocode_data.get("features"):
            response.status_code = 404
            return Result(success=False, data=None, error="Address not found")

        location = geocode_data["features"][0]["geometry"]["coordinates"]
        longitude, latitude = location

        result = repo.search_locations(categories, latitude, longitude, radius)

        if not result.success:
            response.status_code = (
                500 if "API key not configured" in str(result.error) else 404
            )
        return result

    except requests.exceptions.RequestException as e:
        response.status_code = 500
        return Result(
            success=False,
            data=None,
            error=f"Error in geocoding address: {str(e)}",
        )


@router.get("/api/locations", response_model=Result[List[LocationOut]])
def search_pet_friendly_locations(
    response: Response,
    categories: str = Query(
        "pet.shop",
        description="Comma-separated list of categories (e.g., pet.shop,pet.veterinary)",
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
