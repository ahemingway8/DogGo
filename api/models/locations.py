from pydantic import BaseModel
from typing import List


class LocationOut(BaseModel):
    name: str
    address: str
    category: List[str]
    latitude: float
    longitude: float
