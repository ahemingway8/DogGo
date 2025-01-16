import requests
from typing import List
from pydantic import BaseModel
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

        # Debug prints
        print(f"API Key present: {bool(api_key)}")

        params = {
            "categories": categories,
            "filter": f"circle:{longitude},{latitude},{radius}",
            "limit": 20,
            "apiKey": api_key,
        }

        try:
            # Check if API key is configured
            if not params["apiKey"]:
                print("No API key found in environment")
                return Result(
                    success=False,
                    data=None,
                    error="Geoapify API key not configured",
                )

            print(
                f"Making request to Geoapify with params: categories={categories}, lat={latitude}, lon={longitude}, radius={radius}"
            )

            # Make API request
            response = requests.get(geoapify_url, params=params)

            print(f"Geoapify response status: {response.status_code}")
            if not response.ok:
                print(f"Geoapify error response: {response.text}")

            response.raise_for_status()
            data = response.json()

            # Print the number of features received
            features = data.get("features", [])
            print(f"Received {len(features)} locations from Geoapify")

            # Transform API response into LocationOut objects
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
            print(f"Geoapify API request error: {str(e)}")
            return Result(
                success=False, data=None, error=f"Geoapify API error: {str(e)}"
            )
        except Exception as e:
            print(f"Unexpected error in search_locations: {str(e)}")
            import traceback

            print(
                traceback.format_exc()
            )  # This will print the full error traceback
            return Result(
                success=False,
                data=None,
                error=f"An unexpected error occurred: {str(e)}",
            )

    def geocode_address(self, address: str):
        api_key = getenv("GEOAPIFY_API_KEY")
        print(f"Geocoding address: {address}")  # Debug print
        print(f"API Key present: {bool(api_key)}")  # Verify API key exists without exposing it

        url = "https://api.geoapify.com/v1/geocode/search"
        params = {
            "text": address,
            "apiKey": api_key
        }

        try:
            print(f"Making request to Geoapify: {url}")  # Debug print
            response = requests.get(url, params=params)
            print(f"Geoapify response status: {response.status_code}")  # Debug print

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
                print(f"Geocoding successful: {result}")  # Debug print
                return result

            print("No location found in response")  # Debug print
            return {"success": False, "error": "Address not found"}

        except Exception as e:
            print(f"Geocoding error: {str(e)}")  # Already present
            return {"success": False, "error": str(e)}
