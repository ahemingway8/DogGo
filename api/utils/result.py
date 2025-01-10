from typing import Generic, TypeVar, Union
from pydantic import BaseModel

T = TypeVar("T")

class Result(BaseModel, Generic[T]):
    success: bool
    data: Union[T, None]
    error: Union[str, None]

    def __init__(self, success: bool, data: Union[T, None] = None, error:
Union[str, None] = None):
        self.success = success
        self.data = data
        self.error = error

    def __repr__(self) -> str:
        return f"Result(success={self.success}, data={self.data}, error={self.error})"
