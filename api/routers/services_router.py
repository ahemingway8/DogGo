from fastapi import APIRouter, Depends, HTTPException, status
from models.services import ServiceIn, ServiceOut, ReviewIn, ReviewOut
from queries.service_queries import ServiceRepository
from utils.result import Result
from typing import List
from utils.authentication import try_get_jwt_user_data
from models.jwt import JWTUserData

router = APIRouter()


@router.post("/api/services", response_model=Result[ServiceOut])
def create_service(
    service: ServiceIn,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: ServiceRepository = Depends()
):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be logged in to create a service"
        )
    service_data = service.model_dump()
    service_data["created_by"] = user.id
    return repo.create(ServiceIn(**service_data))


@router.get("/api/services", response_model=Result[List[ServiceOut]])
def get_all_services(repo: ServiceRepository = Depends()):
    return repo.get_all()


@router.get("/api/services/{service_id}", response_model=Result[ServiceOut])
def get_service_details(
    service_id: int,
    repo: ServiceRepository = Depends()
):
    service_result = repo.get_by_id(service_id)
    if not service_result.success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found")
    return service_result


@router.delete("/api/services/{service_id}", response_model=Result[bool])
def delete_service(
    service_id: int,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: ServiceRepository = Depends()
):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be logged in to delete a service")
    delete_result = repo.delete(service_id, user.id)
    if not delete_result.success:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=delete_result.error)
    return delete_result


@router.post(
    "/api/services/{service_id}/reviews",
    response_model=Result[ReviewOut]
)
def create_review(
    service_id: int,
    review: ReviewIn,
    user: JWTUserData = Depends(try_get_jwt_user_data),
    repo: ServiceRepository = Depends()
):
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You need to be logged in to leave a review")
    review.created_by = user.id
    review.service_id = service_id
    return repo.create_review(review)


@router.get(
    "/api/services/{service_id}/reviews",
    response_model=Result[List[ReviewOut]]
)
def get_reviews(
    service_id: int,
    repo: ServiceRepository = Depends()
):
    return repo.get_reviews(service_id)
