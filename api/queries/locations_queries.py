import requests
from typing import List
from os import getenv
from models.locations import LocationOut
from utils.result import Result


class LocationRepository:
    def search_locations(
        self,
        categories: str,
        latitude: float,
        longitude: float,
        radius: int = 5000,
    ) -> Result[List[LocationOut]]:
        geoapify_url = "https://api.geoapify.com/v2/places"
        api_key = getenv("GEOAPIFY_API_KEY")

        params = {
            "categories": categories,
            "filter": f"circle:{longitude},{latitude},{radius}",
            "limit": 20,
            "apiKey": api_key,
        }

        try:
            if not params["apiKey"]:
                return Result(
                    success=False,
                    data=None,
                    error="Geoapify API key not configured",
                )
            response = requests.get(geoapify_url, params=params)
            response.raise_for_status()
            data = response.json()

            features = data.get("features", [])

            locations = [
                LocationOut(
                    name=feature["properties"].get("name", "Unnamed"),
                    address=feature["properties"].get(
                        "formatted", "No address"
                    ),
                    category=feature["properties"].get("categories", []),
                    latitude=feature["properties"].get("lat"),
                    longitude=feature["properties"].get("lon"),
                )
                for feature in features
            ]

            return Result(success=True, data=locations, error=None)

        except requests.exceptions.RequestException as e:
            return Result(
                success=False, data=None, error=f"Geoapify API error: {str(e)}"
            )
        except Exception as e:
            return Result(
                success=False,
                data=None,
                error=f"An unexpected error occurred: {str(e)}",
            )

    def geocode_address(self, address: str):
        api_key = getenv("GEOAPIFY_API_KEY")

        url = "https://api.geoapify.com/v1/geocode/search"
        params = {
            "text": address,
            "apiKey": api_key
        }

        try:
            response = requests.get(url, params=params)

            response.raise_for_status()
            data = response.json()

            if data.get("features") and len(data["features"]) > 0:
                location = data["features"][0]
                result = {
                    "success": True,
                    "data": {
                        "latitude": location["properties"]["lat"],
                        "longitude": location["properties"]["lon"]
                    }
                }
                return result
            return {"success": False, "error": "Address not found"}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def autocomplete_address(self, query: str):
        api_key = getenv("GEOAPIFY_API_KEY")
        url = "https://api.geoapify.com/v1/geocode/autocomplete"
        params = {
            "text": query,
            "apiKey": api_key,
            "limit": 10,
            "filter": "countrycode:us",
            "bias": "countrycode:us",
        }

        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()

            suggestions = [
                {
                    "address": feature["properties"]["formatted"],
                    "latitude": feature["properties"]["lat"],
                    "longitude": feature["properties"]["lon"],
                }
                for feature in data.get("features", [])
                if feature["properties"].get("country_code") == "us"
            ]

            return {"success": True, "data": suggestions}
        except Exception as e:
            return {"success": False, "error": str(e)}
