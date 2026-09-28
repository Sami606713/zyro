from typing import List

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.models import (
    Category,
    Order,
    OrderItem,
    Product,
    ProductImage,
    ProductVariant,
    Review,
    Role,
    User,
    UserRole,
)


class AdminService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_dashboard_stats(self) -> dict:
        users_count = await self.db.scalar(select(func.count(User.id)))
        orders_count = await self.db.scalar(select(func.count(Order.id)))
        revenue = await self.db.scalar(
            select(func.coalesce(func.sum(Order.total_amount), 0))
        )
        products_count = await self.db.scalar(select(func.count(Product.id)))

        recent_orders_result = await self.db.execute(
            select(Order, User.email)
            .join(User, Order.user_id == User.id)
            .order_by(Order.created_at.desc())
            .limit(5)
        )
        recent_orders = [
            {
                "id": order.id,
                "user_email": email,
                "status": order.status,
                "total_amount": float(order.total_amount),
                "created_at": order.created_at,
            }
            for order, email in recent_orders_result.all()
        ]

        return {
            "users_count": users_count,
            "orders_count": orders_count,
            "revenue": float(revenue),
            "products_count": products_count,
            "recent_orders": recent_orders,
        }

    async def list_users(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        role: str | None = None,
        is_active: bool | None = None,
    ) -> List[User]:
        query = select(User).options(selectinload(User.user_roles).selectinload(UserRole.role))

        if search:
            query = query.where(
                (User.email.ilike(f"%{search}%"))
                | (User.first_name.ilike(f"%{search}%"))
                | (User.last_name.ilike(f"%{search}%"))
            )
        if is_active is not None:
            query = query.where(User.is_active == is_active)
        if role:
            query = query.join(UserRole, UserRole.user_id == User.id).join(
                Role, Role.id == UserRole.role_id
            ).where(Role.name == role)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().unique().all()

    async def update_user(self, user_id: int, data: dict) -> User | None:
        user = await self.db.get(User, user_id)
        if not user:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(user, key, value)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update_user_roles(self, user_id: int, role_ids: List[int]) -> User | None:
        user = await self.db.get(User, user_id)
        if not user:
            return None

        await self.db.execute(
            UserRole.__table__.delete().where(UserRole.user_id == user_id)
        )
        for role_id in role_ids:
            self.db.add(UserRole(user_id=user_id, role_id=role_id))

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_user(self, user_id: int) -> bool:
        user = await self.db.get(User, user_id)
        if not user:
            return False
        await self.db.delete(user)
        await self.db.commit()
        return True

    async def list_categories(self) -> List[Category]:
        result = await self.db.execute(
            select(Category).options(selectinload(Category.children))
        )
        return result.scalars().unique().all()

    async def create_category(self, data: dict) -> Category:
        category = Category(**data)
        self.db.add(category)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def update_category(self, category_id: int, data: dict) -> Category | None:
        category = await self.db.get(Category, category_id)
        if not category:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(category, key, value)
        await self.db.commit()
        await self.db.refresh(category)
        return category

    async def delete_category(self, category_id: int) -> bool:
        category = await self.db.get(Category, category_id)
        if not category:
            return False
        await self.db.delete(category)
        await self.db.commit()
        return True

    async def list_products(
        self,
        skip: int = 0,
        limit: int = 20,
        search: str | None = None,
        category_id: int | None = None,
        is_active: bool | None = None,
    ) -> List[Product]:
        query = select(Product).options(
            selectinload(Product.variants),
            selectinload(Product.images),
            selectinload(Product.category),
        )

        if search:
            query = query.where(Product.name.ilike(f"%{search}%"))
        if category_id:
            query = query.where(Product.category_id == category_id)
        if is_active is not None:
            query = query.where(Product.is_active == is_active)

        query = query.offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().unique().all()

    async def get_product(self, product_id: int) -> Product | None:
        result = await self.db.execute(
            select(Product)
            .where(Product.id == product_id)
            .options(
                selectinload(Product.variants),
                selectinload(Product.images),
                selectinload(Product.category),
            )
        )
        return result.scalar_one_or_none()

    async def create_product(self, data: dict) -> Product:
        product = Product(**data)
        self.db.add(product)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def update_product(self, product_id: int, data: dict) -> Product | None:
        product = await self.db.get(Product, product_id)
        if not product:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(product, key, value)
        await self.db.commit()
        await self.db.refresh(product)
        return product

    async def delete_product(self, product_id: int) -> bool:
        product = await self.db.get(Product, product_id)
        if not product:
            return False
        await self.db.delete(product)
        await self.db.commit()
        return True

    async def create_variant(self, product_id: int, data: dict) -> ProductVariant:
        variant = ProductVariant(product_id=product_id, **data)
        self.db.add(variant)
        await self.db.commit()
        await self.db.refresh(variant)
        return variant

    async def update_variant(self, variant_id: int, data: dict) -> ProductVariant | None:
        variant = await self.db.get(ProductVariant, variant_id)
        if not variant:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(variant, key, value)
        await self.db.commit()
        await self.db.refresh(variant)
        return variant

    async def delete_variant(self, variant_id: int) -> bool:
        variant = await self.db.get(ProductVariant, variant_id)
        if not variant:
            return False
        await self.db.delete(variant)
        await self.db.commit()
        return True

    async def update_image(self, image_id: int, data: dict) -> ProductImage | None:
        image = await self.db.get(ProductImage, image_id)
        if not image:
            return None
        for key, value in data.items():
            if value is not None:
                setattr(image, key, value)
        await self.db.commit()
        await self.db.refresh(image)
        return image

    async def delete_image(self, image_id: int) -> bool:
        image = await self.db.get(ProductImage, image_id)
        if not image:
            return False
        await self.db.delete(image)
        await self.db.commit()
        return True

    async def list_orders(
        self,
        skip: int = 0,
        limit: int = 20,
        status: str | None = None,
    ) -> List[Order]:
        query = select(Order).options(
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.user),
            selectinload(Order.shipping_address),
            selectinload(Order.billing_address),
        )

        if status:
            query = query.where(Order.status == status)

        query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().unique().all()

    async def get_order(self, order_id: int) -> Order | None:
        result = await self.db.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(
                selectinload(Order.items).selectinload(OrderItem.variant),
                selectinload(Order.user),
                selectinload(Order.shipping_address),
                selectinload(Order.billing_address),
            )
        )
        return result.scalar_one_or_none()

    async def update_order_status(self, order_id: int, status: str) -> Order | None:
        order = await self.db.get(Order, order_id)
        if not order:
            return None
        order.status = status
        await self.db.commit()
        await self.db.refresh(order)
        return order

    async def list_reviews(
        self,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Review]:
        result = await self.db.execute(
            select(Review)
            .options(selectinload(Review.user), selectinload(Review.product))
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().unique().all()

    async def delete_review(self, review_id: int) -> bool:
        review = await self.db.get(Review, review_id)
        if not review:
            return False
        await self.db.delete(review)
        await self.db.commit()
        return True
