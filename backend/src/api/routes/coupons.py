from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.exceptions import BadRequestException, NotFoundException
from src.api.models import Coupon
from src.api.utils.deps import DBDep

router = APIRouter()


class CouponValidationResponse(BaseModel):
    code: str
    discount_percent: float
    valid_until: datetime


@router.post("/coupons/validate", response_model=CouponValidationResponse)
async def validate_coupon(
    code: str,
    db: DBDep,
):
    result = await db.execute(
        select(Coupon).where(Coupon.code == code, Coupon.is_active == True)
    )
    coupon = result.scalar_one_or_none()
    if not coupon:
        raise NotFoundException("Invalid coupon code")

    now = datetime.now(coupon.valid_from.tzinfo)
    if now < coupon.valid_from or now > coupon.valid_until:
        raise BadRequestException("Coupon has expired")

    if coupon.usage_limit and coupon.usage_count >= coupon.usage_limit:
        raise BadRequestException("Coupon usage limit reached")

    return CouponValidationResponse(
        code=coupon.code,
        discount_percent=float(coupon.discount_percent),
        valid_until=coupon.valid_until,
    )
