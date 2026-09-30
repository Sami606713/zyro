from typing import List

from fastapi import APIRouter, Depends, Query, status

from src.api.exceptions import NotFoundException
from src.api.schemas.admin import ReviewResponse
from src.api.services.admin import AdminService
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/reviews", response_model=List[ReviewResponse])
async def list_reviews(
    current_admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    service: AdminService = Depends(get_service),
):
    return await service.list_reviews(skip, limit)


@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    deleted = await service.delete_review(review_id)
    if not deleted:
        raise NotFoundException("Review not found")
