from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import ConflictException, NotFoundException
from src.api.models import Cart, CartItem, Product, ProductImage, ProductVariant, User
from src.api.schemas.user import (
    CartItemCreate,
    CartItemResponse,
    CartItemUpdate,
    CartResponse,
)
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


async def get_or_create_cart(db: AsyncSession, user_id: int) -> Cart:
    result = await db.execute(
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(
            selectinload(Cart.items)
            .selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
            .selectinload(Product.images)
        )
    )
    cart = result.scalar_one_or_none()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        await db.commit()
        await db.refresh(cart)
    return cart


def cart_to_response(cart: Cart) -> CartResponse:
    items = []
    total_amount = 0
    for item in cart.items:
        variant = item.variant
        product = variant.product
        unit_price = float(variant.price_override) if variant.price_override else float(product.base_price)
        item_total = unit_price * item.quantity
        total_amount += item_total
        primary_image = next((img for img in product.images if img.is_primary), None)
        items.append(
            CartItemResponse(
                id=item.id,
                variant_id=variant.id,
                quantity=item.quantity,
                product_name=product.name,
                product_slug=product.slug,
                size=variant.size,
                color=variant.color,
                sku=variant.sku,
                unit_price=unit_price,
                total_price=item_total,
                image_url=primary_image.image_url if primary_image else None,
            )
        )
    return CartResponse(
        id=cart.id,
        items=items,
        total_amount=total_amount,
        total_items=sum(item.quantity for item in cart.items),
    )


@router.get("/cart", response_model=CartResponse)
async def get_cart(
    current_user: CurrentActiveUser,
    db: DBDep,
):
    cart = await get_or_create_cart(db, current_user.id)
    return cart_to_response(cart)


@router.post("/cart/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    data: CartItemCreate,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    variant = await db.get(ProductVariant, data.variant_id)
    if not variant:
        raise NotFoundException(f"Variant {data.variant_id} not found")

    if variant.stock_quantity < data.quantity:
        raise ConflictException(
            f"Insufficient stock. Available: {variant.stock_quantity}, Requested: {data.quantity}"
        )

    cart = await get_or_create_cart(db, current_user.id)

    result = await db.execute(
        select(CartItem).where(
            CartItem.cart_id == cart.id, CartItem.variant_id == data.variant_id
        )
    )
    existing_item = result.scalar_one_or_none()

    if existing_item:
        new_quantity = existing_item.quantity + data.quantity
        if variant.stock_quantity < new_quantity:
            raise ConflictException(
                f"Insufficient stock. Available: {variant.stock_quantity}, Requested: {new_quantity}"
            )
        existing_item.quantity = new_quantity
    else:
        cart_item = CartItem(cart_id=cart.id, variant_id=data.variant_id, quantity=data.quantity)
        db.add(cart_item)

    await db.commit()

    result = await db.execute(
        select(Cart).where(Cart.id == cart.id).options(
            selectinload(Cart.items).selectinload(CartItem.variant).selectinload(ProductVariant.product)
        )
    )
    updated_cart = result.scalar_one()
    return cart_to_response(updated_cart)


@router.put("/cart/items/{item_id}", response_model=CartResponse)
async def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == item_id)
        .options(selectinload(CartItem.cart), selectinload(CartItem.variant))
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item or cart_item.cart.user_id != current_user.id:
        raise NotFoundException("Cart item not found")

    variant = cart_item.variant
    if variant.stock_quantity < data.quantity:
        raise ConflictException(
            f"Insufficient stock. Available: {variant.stock_quantity}, Requested: {data.quantity}"
        )

    cart_item.quantity = data.quantity
    await db.commit()

    result = await db.execute(
        select(Cart).where(Cart.id == cart_item.cart_id).options(
            selectinload(Cart.items).selectinload(CartItem.variant).selectinload(ProductVariant.product)
        )
    )
    cart = result.scalar_one()
    return cart_to_response(cart)


@router.delete("/cart/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(
    item_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == item_id)
        .options(selectinload(CartItem.cart))
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item or cart_item.cart.user_id != current_user.id:
        raise NotFoundException("Cart item not found")

    await db.delete(cart_item)
    await db.commit()


@router.delete("/cart", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(Cart).where(Cart.user_id == current_user.id).options(selectinload(Cart.items))
    )
    cart = result.scalar_one_or_none()
    if cart and cart.items:
        for item in cart.items:
            await db.delete(item)
        await db.commit()
