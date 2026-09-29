from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import ConflictException, NotFoundException
from src.api.models import Product, User, WishlistItem
from src.api.schemas.user import WishlistItemResponse
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


@router.get("/wishlist", response_model=list[WishlistItemResponse])
async def get_wishlist(
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(WishlistItem)
        .where(WishlistItem.user_id == current_user.id)
        .options(selectinload(WishlistItem.product))
    )
    items = result.scalars().all()
    return [
        WishlistItemResponse(
            id=item.id,
            product_id=item.product.id,
            product_name=item.product.name,
            product_slug=item.product.slug,
            base_price=float(item.product.base_price),
            image_url=item.product.images[0].image_url if item.product.images else None,
        )
        for item in items
    ]


@router.post("/wishlist/{product_id}", status_code=status.HTTP_201_CREATED)
async def add_to_wishlist(
    product_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    product = await db.get(Product, product_id)
    if not product:
        raise NotFoundException("Product not found")

    existing = await db.execute(
        select(WishlistItem).where(
            WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id
        )
    )
    if existing.scalar_one_or_none():
        raise ConflictException("Product already in wishlist")

    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    db.add(item)
    await db.commit()
    return {"message": "Added to wishlist"}


@router.delete("/wishlist/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_wishlist(
    product_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(WishlistItem).where(
            WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundException("Item not found in wishlist")
    await db.delete(item)
    await db.commit()
