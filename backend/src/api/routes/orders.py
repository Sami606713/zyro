from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.exceptions import BadRequestException, NotFoundException, UnauthorizedException
from src.api.models import Address, Order, OrderItem, ProductVariant, User
from src.api.schemas.user import TokenPayload
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


@router.post("/orders", status_code=status.HTTP_201_CREATED)
async def create_order(
    data: dict,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    items = data.get("items", [])
    if not items:
        raise BadRequestException("No items in order")

    shipping_address = Address(
        user_id=current_user.id,
        address_line1=data.get("address", ""),
        city=data.get("city", ""),
        state=data.get("state", "Khyber Pakhtunkhwa"),
        postal_code=data.get("postal_code", "22000"),
        country=data.get("country", "Pakistan"),
        phone=data.get("phone", ""),
        is_default=True,
    )
    db.add(shipping_address)
    await db.flush()

    total = 0
    order = Order(
        user_id=current_user.id,
        status="pending",
        total_amount=0,
        shipping_address_id=shipping_address.id,
        billing_address_id=shipping_address.id,
    )
    db.add(order)
    await db.flush()

    for item_data in items:
        variant = await db.get(ProductVariant, item_data["variant_id"])
        if not variant:
            raise NotFoundException(f"Variant {item_data['variant_id']} not found")

        quantity = item_data.get("qty", 1)
        unit_price = float(variant.price_override or 0)
        if unit_price == 0:
            from src.api.models import Product
            product = await db.get(Product, variant.product_id)
            unit_price = float(product.base_price)

        item_total = unit_price * quantity
        total += item_total

        order_item = OrderItem(
            order_id=order.id,
            variant_id=variant.id,
            quantity=quantity,
            unit_price=unit_price,
            total_price=item_total,
        )
        db.add(order_item)

    order.total_amount = total
    await db.commit()
    await db.refresh(order)

    return {"order_id": order.id, "status": order.status, "total": total}
