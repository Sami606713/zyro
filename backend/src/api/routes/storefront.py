from typing import List

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select, func, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import ConflictException, NotFoundException
from src.api.models import Category, Product, ProductVariant, Review
from src.api.schemas.admin import CategoryResponse, ProductResponse
from src.api.schemas.user import ReviewCreate, ReviewResponse
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


@router.get("/products")
async def list_products(
    category_id: int | None = None,
    search: str | None = None,
    min_price: float | None = Query(None, gt=0),
    max_price: float | None = Query(None, gt=0),
    size: str | None = None,
    color: str | None = None,
    sort_by: str | None = Query(None, pattern="^(name|price|newest|popularity)$"),
    sort_order: str | None = Query("asc", pattern="^(asc|desc)$"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: DBDep = None,
):
    query = select(Product).options(
        selectinload(Product.variants),
        selectinload(Product.images),
        selectinload(Product.category),
    ).where(Product.is_active == True)

    count_query = select(func.count(Product.id)).where(Product.is_active == True)

    if category_id:
        query = query.where(Product.category_id == category_id)
        count_query = count_query.where(Product.category_id == category_id)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))
        count_query = count_query.where(Product.name.ilike(f"%{search}%"))
    if min_price:
        query = query.where(Product.base_price >= min_price)
        count_query = count_query.where(Product.base_price >= min_price)
    if max_price:
        query = query.where(Product.base_price <= max_price)
        count_query = count_query.where(Product.base_price <= max_price)
    if size:
        query = query.join(Product.variants).where(ProductVariant.size == size)
        count_query = count_query.join(Product.variants).where(ProductVariant.size == size)
    if color:
        query = query.join(Product.variants).where(ProductVariant.color == color)
        count_query = count_query.join(Product.variants).where(ProductVariant.color == color)

    if sort_by == "name":
        query = query.order_by(asc(Product.name) if sort_order == "asc" else desc(Product.name))
    elif sort_by == "price":
        query = query.order_by(asc(Product.base_price) if sort_order == "asc" else desc(Product.base_price))
    elif sort_by == "newest":
        query = query.order_by(desc(Product.created_at))
    elif sort_by == "popularity":
        query = query.outerjoin(Review).group_by(Product.id).order_by(desc(func.count(Review.id)))
    else:
        query = query.order_by(desc(Product.created_at))

    total = await db.scalar(count_query)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    products = result.scalars().unique().all()

    return {
        "items": products,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + limit) < total,
    }


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
    product = result.scalar_one_or_none()
    if not product:
        raise NotFoundException("Product not found")
    return product


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
    category = result.scalar_one_or_none()
    if not category:
        raise NotFoundException("Category not found")
    return category


@router.get("/products/{slug}/reviews")
async def get_product_reviews(
    slug: str,
    db: DBDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    product = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True)
    )
    product = product.scalar_one_or_none()
    if not product:
        raise NotFoundException("Product not found")

    count_query = select(func.count(Review.id)).where(Review.product_id == product.id)
    total = await db.scalar(count_query)

    result = await db.execute(
        select(Review)
        .where(Review.product_id == product.id)
        .options(selectinload(Review.user))
        .order_by(Review.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    reviews = result.scalars().unique().all()

    return {
        "items": reviews,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + limit) < total,
    }


@router.post("/products/{slug}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    slug: str,
    data: ReviewCreate,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    product = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True)
    )
    product = product.scalar_one_or_none()
    if not product:
        raise NotFoundException("Product not found")

    existing = await db.execute(
        select(Review).where(
            Review.user_id == current_user.id, Review.product_id == product.id
        )
    )
    if existing.scalar_one_or_none():
        raise ConflictException("You have already reviewed this product")

    review = Review(
        user_id=current_user.id,
        product_id=product.id,
        rating=data.rating,
        title=data.title,
        comment=data.comment,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


@router.get("/products/{slug}/related", response_model=List[ProductResponse])
async def get_related_products(
    slug: str,
    db: DBDep,
    limit: int = Query(4, ge=1, le=12),
):
    product = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active == True)
    )
    product = product.scalar_one_or_none()
    if not product:
        raise NotFoundException("Product not found")

    result = await db.execute(
        select(Product)
        .where(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.is_active == True,
        )
        .options(
            selectinload(Product.variants),
            selectinload(Product.images),
            selectinload(Product.category),
        )
        .limit(limit)
    )
    return result.scalars().unique().all()


@router.get("/size-guide")
async def get_size_guide():
    return {
        "sizes": [
            {"size": "XS", "chest": "32-34", "waist": "26-28", "hips": "34-36"},
            {"size": "S", "chest": "34-36", "waist": "28-30", "hips": "36-38"},
            {"size": "M", "chest": "38-40", "waist": "32-34", "hips": "40-42"},
            {"size": "L", "chest": "42-44", "waist": "36-38", "hips": "44-46"},
            {"size": "XL", "chest": "46-48", "waist": "40-42", "hips": "48-50"},
            {"size": "XXL", "chest": "50-52", "waist": "44-46", "hips": "52-54"},
        ]
    }
