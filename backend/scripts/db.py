import argparse
import asyncio
import os
import random
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

from dotenv import load_dotenv

BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))
load_dotenv(BACKEND_ROOT / ".env")

import bcrypt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from src.api.models import (
    Address,
    Base,
    Cart,
    CartItem,
    Category,
    Order,
    OrderItem,
    Permission,
    Product,
    ProductImage,
    ProductVariant,
    Review,
    Role,
    RolePermission,
    User,
    UserRole,
)

DATABASE_URL = os.getenv("POSTGRES_URI_CUSTOM")

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


def run_migrations() -> None:
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=BACKEND_ROOT,
    )
    if result.returncode != 0:
        print("Migration failed")
        sys.exit(1)
    print("Migrations applied successfully")


async def seed() -> None:
    async with async_session() as session:
        async with session.begin():
            permissions = {}
            permission_names = [
                "users:read",
                "users:write",
                "users:delete",
                "products:read",
                "products:write",
                "products:delete",
                "orders:read",
                "orders:write",
                "orders:delete",
                "categories:read",
                "categories:write",
                "categories:delete",
            ]

            for name in permission_names:
                result = await session.execute(
                    select(Permission).where(Permission.name == name)
                )
                perm = result.scalar_one_or_none()
                if not perm:
                    perm = Permission(name=name, description=f"Permission to {name}")
                    session.add(perm)
                    await session.flush()
                permissions[name] = perm

            admin_role = Role(name="admin", description="Full system access")
            admin_role.role_permissions = [
                RolePermission(permission=perm) for perm in permissions.values()
            ]
            session.add(admin_role)
            await session.flush()

            user_perms = [
                permissions["users:read"],
                permissions["products:read"],
                permissions["orders:read"],
                permissions["orders:write"],
                permissions["categories:read"],
            ]
            user_role = Role(name="user", description="Standard customer access")
            user_role.role_permissions = [
                RolePermission(permission=p) for p in user_perms
            ]
            session.add(user_role)
            await session.flush()

            result = await session.execute(
                select(User).where(User.email == "admin@zyro.com")
            )
            if not result.scalar_one_or_none():
                password_hash = bcrypt.hashpw(
                    "admin123".encode(), bcrypt.gensalt()
                ).decode()
                admin = User(
                    email="admin@zyro.com",
                    password_hash=password_hash,
                    first_name="Admin",
                    last_name="User",
                    is_active=True,
                    is_verified=True,
                )
                admin.user_roles = [UserRole(role=admin_role)]
                session.add(admin)

        await session.commit()
    print("Database seeded successfully")


async def seed_data() -> None:
    async with async_session() as session:
        async with session.begin():
            categories = [
                Category(name="Apparel", slug="apparel", description="Everyday clothing essentials"),
                Category(name="Bottomwear", slug="bottomwear", description="Trousers, jeans, and shorts"),
                Category(name="Outerwear", slug="outerwear", description="Jackets, coats, and layers"),
                Category(name="Accessories", slug="accessories", description="Belts, caps, and extras"),
            ]
            for cat in categories:
                session.add(cat)
            await session.flush()

            products_data = [
                {
                    "name": "Night Crew",
                    "slug": "night-crew",
                    "description": "A relaxed-fit crew neck t-shirt in heavyweight cotton.",
                    "base_price": 3499,
                    "category_slug": "apparel",
                    "variants": [
                        {"size": "S", "color": "Black", "stock": 15},
                        {"size": "M", "color": "Black", "stock": 20},
                        {"size": "L", "color": "Black", "stock": 18},
                        {"size": "XL", "color": "Black", "stock": 10},
                    ],
                    "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
                },
                {
                    "name": "Stone Trouser",
                    "slug": "stone-trouser",
                    "description": "Tapered fit trousers in a durable stone wash fabric.",
                    "base_price": 5499,
                    "category_slug": "bottomwear",
                    "variants": [
                        {"size": "28", "color": "Stone", "stock": 8},
                        {"size": "30", "color": "Stone", "stock": 12},
                        {"size": "32", "color": "Stone", "stock": 14},
                        {"size": "34", "color": "Stone", "stock": 6},
                    ],
                    "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
                },
                {
                    "name": "Field Jacket",
                    "slug": "field-jacket",
                    "description": "A utility-inspired field jacket with multiple pockets.",
                    "base_price": 12999,
                    "category_slug": "outerwear",
                    "variants": [
                        {"size": "S", "color": "Olive", "stock": 5},
                        {"size": "M", "color": "Olive", "stock": 7},
                        {"size": "L", "color": "Olive", "stock": 4},
                    ],
                    "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
                },
                {
                    "name": "Charcoal Overshirt",
                    "slug": "charcoal-overshirt",
                    "description": "A versatile overshirt in a soft charcoal flannel.",
                    "base_price": 7999,
                    "category_slug": "outerwear",
                    "variants": [
                        {"size": "M", "color": "Charcoal", "stock": 9},
                        {"size": "L", "color": "Charcoal", "stock": 11},
                        {"size": "XL", "color": "Charcoal", "stock": 3},
                    ],
                    "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
                },
                {
                    "name": "Matte Belt",
                    "slug": "matte-belt",
                    "description": "A minimalist matte black belt with a brushed steel buckle.",
                    "base_price": 2499,
                    "category_slug": "accessories",
                    "variants": [
                        {"size": "One Size", "color": "Black", "stock": 25},
                    ],
                    "image_url": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800",
                },
                {
                    "name": "Canvas Cap",
                    "slug": "canvas-cap",
                    "description": "A six-panel canvas cap with an adjustable strap.",
                    "base_price": 1999,
                    "category_slug": "accessories",
                    "variants": [
                        {"size": "One Size", "color": "Sand", "stock": 30},
                        {"size": "One Size", "color": "Black", "stock": 22},
                    ],
                    "image_url": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
                },
            ]

            category_map = {cat.slug: cat for cat in categories}
            all_variants = []

            for pdata in products_data:
                category = category_map[pdata["category_slug"]]
                product = Product(
                    name=pdata["name"],
                    slug=pdata["slug"],
                    description=pdata["description"],
                    base_price=pdata["base_price"],
                    category_id=category.id,
                    is_active=True,
                )
                session.add(product)
                await session.flush()

                image = ProductImage(
                    product_id=product.id,
                    image_url=pdata["image_url"],
                    alt_text=pdata["name"],
                    is_primary=True,
                    sort_order=0,
                )
                session.add(image)

                for vdata in pdata["variants"]:
                    sku = f"{pdata['slug']}-{vdata['size']}-{vdata['color']}".lower().replace(" ", "-")
                    variant = ProductVariant(
                        product_id=product.id,
                        size=vdata["size"],
                        color=vdata["color"],
                        sku=sku,
                        stock_quantity=vdata["stock"],
                        price_override=None,
                    )
                    session.add(variant)
                    all_variants.append(variant)

            await session.flush()

            first_names = ["Ayaan", "Sami", "Bilal", "Hamza", "Usman", "Zara", "Fatima", "Ali", "Hassan", "Noor"]
            last_names = ["Khan", "Malik", "Ahmed", "Raza", "Hussain", "Shah", "Qureshi", "Syed", "Chaudhry", "Sheikh"]
            cities = ["Haripur", "Abbottabad", "Havelian", "Islamabad", "Lahore"]
            streets = ["Main Bazaar Road", "Street 4, Sector B", "College Road", "Market Road", "Gulberg Town"]

            password_hash = bcrypt.hashpw("password123".encode(), bcrypt.gensalt()).decode()
            user_role = await session.execute(select(Role).where(Role.name == "user"))
            user_role = user_role.scalar_one()

            users = []
            for i in range(10):
                user = User(
                    email=f"user{i+1}@example.com",
                    password_hash=password_hash,
                    first_name=first_names[i],
                    last_name=last_names[i],
                    phone=f"+92 300 {random.randint(1000000, 9999999)}",
                    is_active=True,
                    is_verified=True,
                )
                user.user_roles = [UserRole(role=user_role)]
                session.add(user)
                users.append(user)

            await session.flush()

            for user in users:
                address = Address(
                    user_id=user.id,
                    address_line1=f"{random.randint(1, 50)}, {random.choice(streets)}",
                    city=random.choice(cities),
                    state="Khyber Pakhtunkhwa",
                    postal_code=f"{random.randint(22000, 22999)}",
                    country="Pakistan",
                    phone=user.phone,
                    is_default=True,
                )
                session.add(address)

            await session.flush()

            statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
            status_weights = [2, 3, 2, 3, 1]

            for i in range(20):
                user = random.choice(users)
                address = await session.execute(
                    select(Address).where(Address.user_id == user.id)
                )
                address = address.scalar_one()

                status = random.choices(statuses, weights=status_weights)[0]
                days_ago = random.randint(0, 30)
                created_at = datetime.utcnow() - timedelta(days=days_ago)

                order = Order(
                    user_id=user.id,
                    status=status,
                    total_amount=0,
                    shipping_address_id=address.id,
                    billing_address_id=address.id,
                    created_at=created_at,
                )
                session.add(order)
                await session.flush()

                num_items = random.randint(1, 3)
                total = 0
                for _ in range(num_items):
                    variant = random.choice(all_variants)
                    quantity = random.randint(1, 2)
                    unit_price = float(variant.price_override or 0)
                    if unit_price == 0:
                        product = await session.execute(
                            select(Product).where(Product.id == variant.product_id)
                        )
                        unit_price = float(product.scalar_one().base_price)
                    item_total = unit_price * quantity
                    total += item_total

                    order_item = OrderItem(
                        order_id=order.id,
                        variant_id=variant.id,
                        quantity=quantity,
                        unit_price=unit_price,
                        total_price=item_total,
                    )
                    session.add(order_item)

                order.total_amount = total

            await session.flush()

            products = await session.execute(select(Product))
            products = products.scalars().all()

            used_pairs = set()
            for _ in range(15):
                user = random.choice(users)
                product = random.choice(products)
                pair = (user.id, product.id)
                if pair in used_pairs:
                    continue
                used_pairs.add(pair)
                rating = random.choices([1, 2, 3, 4, 5], weights=[1, 1, 2, 4, 5])[0]
                comments = [
                    "Great quality, fits perfectly!",
                    "Love the fabric and the fit.",
                    "Good value for the price.",
                    "Exactly as described. Fast delivery too.",
                    "The color is slightly different but still nice.",
                    "Very comfortable, will buy again.",
                    "Decent quality for the price.",
                    "Perfect for everyday wear.",
                    None,
                    None,
                ]
                review = Review(
                    user_id=user.id,
                    product_id=product.id,
                    rating=rating,
                    comment=random.choice(comments),
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 20)),
                )
                session.add(review)

        await session.commit()
    print("Dummy e-commerce data seeded successfully")


async def reset_db() -> None:
    engine = create_async_engine(DATABASE_URL)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print("All tables dropped")

    await engine.dispose()

    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=BACKEND_ROOT,
    )
    if result.returncode != 0:
        print("Migration failed")
        sys.exit(1)
    print("Database reset and migrations applied successfully")


def main() -> None:
    parser = argparse.ArgumentParser(description="Database management CLI")
    parser.add_argument(
        "command",
        choices=["migrate", "seed", "seed-data", "reset"],
        help="Command to run: migrate, seed, seed-data, or reset",
    )
    args = parser.parse_args()

    if args.command == "migrate":
        run_migrations()
    elif args.command == "seed":
        asyncio.run(seed())
    elif args.command == "seed-data":
        asyncio.run(seed_data())
    elif args.command == "reset":
        asyncio.run(reset_db())


if __name__ == "__main__":
    main()
