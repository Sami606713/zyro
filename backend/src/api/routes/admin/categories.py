from typing import List

from fastapi import APIRouter, Depends, status

from src.api.exceptions import NotFoundException
from src.api.schemas.admin import CategoryCreate, CategoryResponse, CategoryUpdate
from src.api.services.admin import AdminService
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    return await service.list_categories()


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    return await service.create_category(data.model_dump())


@router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    category = await service.update_category(category_id, data.model_dump(exclude_unset=True))
    if not category:
        raise NotFoundException("Category not found")
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    deleted = await service.delete_category(category_id)
    if not deleted:
        raise NotFoundException("Category not found")
