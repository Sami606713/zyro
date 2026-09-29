from typing import List

from fastapi import APIRouter, Depends, Query

from src.api.exceptions import NotFoundException
from src.api.schemas.admin import OrderResponse, OrderStatusUpdate
from src.api.services.admin import AdminService
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/orders", response_model=List[OrderResponse])
async def list_orders(
    current_admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: str | None = None,
    service: AdminService = Depends(get_service),
):
    return await service.list_orders(skip, limit, status)


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    order = await service.get_order(order_id)
    if not order:
        raise NotFoundException("Order not found")
    return order


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    data: OrderStatusUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    order = await service.update_order_status(order_id, data.status)
    if not order:
        raise NotFoundException("Order not found")
    return order
