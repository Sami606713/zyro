from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import BadRequestException, NotFoundException
from src.api.models import Order, ReturnRequest
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


@router.post("/orders/{order_id}/return", status_code=status.HTTP_201_CREATED)
async def request_return(
    order_id: int,
    reason: str,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(Order).where(
            Order.id == order_id, Order.user_id == current_user.id
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise NotFoundException("Order not found")

    if order.status not in ("delivered", "shipped"):
        raise BadRequestException(
            f"Cannot request return for order with status '{order.status}'"
        )

    existing = await db.execute(
        select(ReturnRequest).where(
            ReturnRequest.order_id == order_id,
            ReturnRequest.status == "pending",
        )
    )
    if existing.scalar_one_or_none():
        raise BadRequestException("A return request already exists for this order")

    return_request = ReturnRequest(
        order_id=order_id,
        user_id=current_user.id,
        reason=reason,
        status="pending",
    )
    db.add(return_request)
    await db.commit()
    await db.refresh(return_request)
    return return_request


@router.get("/returns")
async def list_my_returns(
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(ReturnRequest)
        .where(ReturnRequest.user_id == current_user.id)
        .options(selectinload(ReturnRequest.order))
        .order_by(ReturnRequest.created_at.desc())
    )
    return result.scalars().unique().all()


@router.get("/returns/{return_id}")
async def get_return_status(
    return_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(ReturnRequest).where(
            ReturnRequest.id == return_id,
            ReturnRequest.user_id == current_user.id,
        )
    )
    return_request = result.scalar_one_or_none()
    if not return_request:
        raise NotFoundException("Return request not found")
    return return_request
