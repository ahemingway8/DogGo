from typing import Generic, TypeVar, Union
from pydantic import BaseModel

T = TypeVar("T")

class Result(BaseModel, Generic[T]):
    success: bool
    data: Union[T, None] = None
    error: Union[str, None] = None

    class Config:
        arbitrary_types_allowed = True
