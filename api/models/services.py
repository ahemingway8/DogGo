from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class ServiceIn(BaseModel):
    name: str
    description: str
    price: Optional[float] = None
    location: str
    contact: str
    picture_url: Optional[HttpUrl]
    created_by: int


class ServiceOut(BaseModel):
    id: int
    name: str
    description: str
    price: Optional[float] = None
    location: str
    contact: str
    picture_url: Optional[HttpUrl]
    created_by: int


class ReviewIn(BaseModel):
    rating: int
    comment: Optional[str]
    service_id: int
    created_by: int


class ReviewOut(BaseModel):
    id: int
    rating: int
    comment: Optional[str]
    service_id: int
    created_by: int
