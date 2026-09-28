from typing import List

from fastapi import APIRouter, Depends, Query

from src.api.exceptions import NotFoundException
from src.api.schemas.admin import AdminUserUpdate, AdminUserRoleUpdate
from src.api.schemas.user import UserResponse
from src.api.services.admin import AdminService
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/users", response_model=List[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
    service: AdminService = Depends(get_service),
    current_admin: CurrentAdmin = None,
):
    return await service.list_users(skip, limit, search, role, is_active)


@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    data: AdminUserUpdate,
    service: AdminService = Depends(get_service),
    current_admin: CurrentAdmin = None,
):
    user = await service.update_user(user_id, data.model_dump(exclude_unset=True))
    if not user:
        raise NotFoundException("User not found")
    return user


@router.put("/users/{user_id}/roles", response_model=UserResponse)
async def update_user_roles(
    user_id: int,
    data: AdminUserRoleUpdate,
    service: AdminService = Depends(get_service),
    current_admin: CurrentAdmin = None,
):
    user = await service.update_user_roles(user_id, data.role_ids)
    if not user:
        raise NotFoundException("User not found")
    return user


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    service: AdminService = Depends(get_service),
    current_admin: CurrentAdmin = None,
):
    deleted = await service.delete_user(user_id)
    if not deleted:
        raise NotFoundException("User not found")
