from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class EventIn(BaseModel):
    name: str
    description: str
    address: str
    date_time: datetime
    picture_url: Optional[HttpUrl]
