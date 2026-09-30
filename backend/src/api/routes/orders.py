from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import (
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
)
from src.api.models import Address, Order, OrderItem, Product, ProductVariant, User
from src.api.schemas.user import (
    OrderCreate,
    OrderResponse,
    OrderItemCreate,
    TokenPayload,
    GuestOrderCreate,
)
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


@router.post("/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    data: OrderCreate,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    shipping_address = await db.get(Address, data.shipping_address_id)
    if not shipping_address or shipping_address.user_id != current_user.id:
        raise NotFoundException("Shipping address not found")

    billing_address_id = data.billing_address_id or data.shipping_address_id
    if billing_address_id != data.shipping_address_id:
        billing_address = await db.get(Address, billing_address_id)
        if not billing_address or billing_address.user_id != current_user.id:
            raise NotFoundException("Billing address not found")

    total = 0
    order = Order(
        user_id=current_user.id,
        status="pending",
        total_amount=0,
        shipping_address_id=data.shipping_address_id,
        billing_address_id=billing_address_id,
        notes=data.notes,
    )
    db.add(order)
    await db.flush()

    for item_data in data.items:
        variant = await db.get(ProductVariant, item_data.variant_id, options=[selectinload(ProductVariant.product)])
        if not variant:
            raise NotFoundException(f"Variant {item_data.variant_id} not found")

        if variant.stock_quantity < item_data.quantity:
            raise ConflictException(
                f"Insufficient stock for variant {variant.sku}. "
                f"Available: {variant.stock_quantity}, Requested: {item_data.quantity}"
            )

        unit_price = float(variant.price_override) if variant.price_override else float(variant.product.base_price)
        item_total = unit_price * item_data.quantity
        total += item_total

        variant.stock_quantity -= item_data.quantity

        order_item = OrderItem(
            order_id=order.id,
            variant_id=variant.id,
            quantity=item_data.quantity,
            unit_price=unit_price,
            total_price=item_total,
        )
        db.add(order_item)

    order.total_amount = total
    await db.commit()
    await db.refresh(order)

    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.shipping_address),
            selectinload(Order.billing_address),
        )
    )
    return result.scalar_one()


@router.get("/orders", response_model=list[OrderResponse])
async def list_user_orders(
    current_user: CurrentActiveUser,
    db: DBDep,
    skip: int = 0,
    limit: int = 20,
):
    result = await db.execute(
        select(Order)
        .where(Order.user_id == current_user.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.shipping_address),
            selectinload(Order.billing_address),
        )
        .order_by(Order.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().unique().all()


@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_user_order(
    order_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id, Order.user_id == current_user.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.shipping_address),
            selectinload(Order.billing_address),
        )
    )
    order = result.scalar_one_or_none()
    if not order:
        raise NotFoundException("Order not found")
    return order


@router.post("/orders/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(Order)
        .where(Order.id == order_id, Order.user_id == current_user.id)
        .options(selectinload(Order.items).selectinload(OrderItem.variant))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise NotFoundException("Order not found")

    if order.status != "pending":
        raise BadRequestException(f"Cannot cancel order with status '{order.status}'")

    for item in order.items:
        variant = await db.get(ProductVariant, item.variant_id)
        if variant:
            variant.stock_quantity += item.quantity

    order.status = "cancelled"
    await db.commit()
    await db.refresh(order)

    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.shipping_address),
            selectinload(Order.billing_address),
        )
    )
    return result.scalar_one()


@router.post("/orders/guest", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_guest_order(
    data: GuestOrderCreate,
    db: DBDep,
):
    shipping_address = Address(
        user_id=None,
        address_line1=data.shipping_address.address_line1,
        address_line2=data.shipping_address.address_line2,
        city=data.shipping_address.city,
        state=data.shipping_address.state,
        postal_code=data.shipping_address.postal_code,
        country=data.shipping_address.country,
        phone=data.shipping_address.phone,
        is_default=False,
    )
    db.add(shipping_address)
    await db.flush()

    billing_address_id = shipping_address.id
    if data.billing_address:
        billing_address = Address(
            user_id=None,
            address_line1=data.billing_address.address_line1,
            address_line2=data.billing_address.address_line2,
            city=data.billing_address.city,
            state=data.billing_address.state,
            postal_code=data.billing_address.postal_code,
            country=data.billing_address.country,
            phone=data.billing_address.phone,
            is_default=False,
        )
        db.add(billing_address)
        await db.flush()
        billing_address_id = billing_address.id

    total = 0
    order = Order(
        user_id=None,
        status="pending",
        total_amount=0,
        shipping_address_id=shipping_address.id,
        billing_address_id=billing_address_id,
        notes=data.notes,
        guest_email=data.email,
        guest_first_name=data.first_name,
        guest_last_name=data.last_name,
        guest_phone=data.phone,
    )
    db.add(order)
    await db.flush()

    for item_data in data.items:
        variant = await db.get(ProductVariant, item_data.variant_id)
        if not variant:
            raise NotFoundException(f"Variant {item_data.variant_id} not found")

        if variant.stock_quantity < item_data.quantity:
            raise ConflictException(
                f"Insufficient stock for variant {variant.sku}. "
                f"Available: {variant.stock_quantity}, Requested: {item_data.quantity}"
            )

        unit_price = float(variant.price_override) if variant.price_override else float(variant.product.base_price)
        item_total = unit_price * item_data.quantity
        total += item_total

        variant.stock_quantity -= item_data.quantity

        order_item = OrderItem(
            order_id=order.id,
            variant_id=variant.id,
            quantity=item_data.quantity,
            unit_price=unit_price,
            total_price=item_total,
        )
        db.add(order_item)

    order.total_amount = total
    await db.commit()
    await db.refresh(order)

    result = await db.execute(
        select(Order)
        .where(Order.id == order.id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.shipping_address),
            selectinload(Order.billing_address),
        )
    )
    return result.scalar_one()
