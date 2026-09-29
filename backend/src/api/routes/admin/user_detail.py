from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import NotFoundException
from src.api.models import Address, Order, OrderItem, User
from src.api.schemas.admin import UserDetailResponse
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


@router.get("/users/{user_id}", response_model=UserDetailResponse)
async def get_user_detail(
    user_id: int,
    current_admin: CurrentAdmin,
    db: DBDep,
):
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.addresses),
            selectinload(User.orders).selectinload(Order.items).selectinload(OrderItem.variant),
        )
    )
    user = result.scalar_one_or_none()
    if not user:
        raise NotFoundException("User not found")
    return user
