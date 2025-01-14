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
            radius: int = 5000
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
            if not params["apiKey"]:
                print("No API key found in environment")
                return Result(
                    success=False,
                    data=None,
                    error="Geoapify API key not configured"
                )

            print(f"Making request to Geoapify with params: categories={categories}, lat={latitude}, lon={longitude}, radius={radius}")

            response = requests.get(geoapify_url, params=params)

            print(f"Geoapify response status: {response.status_code}")
            if not response.ok:
                print(f"Geoapify error response: {response.text}")

            response.raise_for_status()
            data = response.json()

            features = data.get("features", [])
            print(f"Received {len(features)} locations from Geoapify")

            locations = [
                LocationOut(
                    name=feature["properties"].get("name", "Unnamed"),
                    address=feature["properties"].get("formatted", "No address"),
                    category=feature["properties"].get("categories", []),
                    latitude=feature["properties"].get("lat"),
                    longitude=feature["properties"].get("lon"),
                )
                for feature in features
            ]

            return Result(
                success=True,
                data=locations,
                error=None
            )

        except requests.exceptions.RequestException as e:
            print(f"Geoapify API request error: {str(e)}")
            return Result(
                success=False,
                data=None,
                error=f"Geoapify API error: {str(e)}"
            )
        except Exception as e:
            print(f"Unexpected error in search_locations: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return Result(
                success=False,
                data=None,
                error=f"An unexpected error occurred: {str(e)}"
            )
