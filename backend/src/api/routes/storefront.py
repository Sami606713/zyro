from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.models import Category, Product
from src.api.schemas.admin import CategoryResponse, ProductResponse
from src.api.utils.deps import DBDep

router = APIRouter()


@router.get("/products", response_model=List[ProductResponse])
async def list_products(
    category_id: int | None = None,
    search: str | None = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: DBDep = None,
):
    query = select(Product).options(
        selectinload(Product.variants),
        selectinload(Product.images),
        selectinload(Product.category),
    ).where(Product.is_active == True)

    if category_id:
        query = query.where(Product.category_id == category_id)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().unique().all()


@router.get("/products/{slug}", response_model=ProductResponse)
async def get_product(slug: str, db: DBDep):
    result = await db.execute(
        select(Product)
        .where(Product.slug == slug, Product.is_active == True)
        .options(
            selectinload(Product.variants),
            selectinload(Product.images),
            selectinload(Product.category),
        )
    )
    return result.scalar_one_or_none()


@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(db: DBDep):
    result = await db.execute(
        select(Category).options(selectinload(Category.children))
    )
    return result.scalars().unique().all()


@router.get("/categories/{slug}", response_model=CategoryResponse)
async def get_category(slug: str, db: DBDep):
    result = await db.execute(
        select(Category).where(Category.slug == slug)
    )
    return result.scalar_one_or_none()
