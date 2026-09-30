from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.exceptions import NotFoundException
from src.api.models import Coupon
from src.api.schemas.admin import CouponCreate, CouponResponse, CouponUpdate
from src.api.services.admin import AdminService
from src.api.utils.deps import CurrentAdmin, DBDep

router = APIRouter()


def get_service(db: DBDep) -> AdminService:
    return AdminService(db)


@router.get("/coupons", response_model=List[CouponResponse])
async def list_coupons(
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    result = await service.db.execute(select(Coupon).order_by(Coupon.created_at.desc()))
    return result.scalars().unique().all()


@router.post("/coupons", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
async def create_coupon(
    data: CouponCreate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    coupon = Coupon(**data.model_dump())
    service.db.add(coupon)
    await service.db.commit()
    await service.db.refresh(coupon)
    return coupon


@router.put("/coupons/{coupon_id}", response_model=CouponResponse)
async def update_coupon(
    coupon_id: int,
    data: CouponUpdate,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    coupon = await service.db.get(Coupon, coupon_id)
    if not coupon:
        raise NotFoundException("Coupon not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(coupon, key, value)
    await service.db.commit()
    await service.db.refresh(coupon)
    return coupon


@router.delete("/coupons/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_coupon(
    coupon_id: int,
    current_admin: CurrentAdmin,
    service: AdminService = Depends(get_service),
):
    coupon = await service.db.get(Coupon, coupon_id)
    if not coupon:
        raise NotFoundException("Coupon not found")
    await service.db.delete(coupon)
    await service.db.commit()
