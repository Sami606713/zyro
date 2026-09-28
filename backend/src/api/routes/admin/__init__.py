from fastapi import APIRouter

from . import categories, dashboard, orders, products, reviews, users

admin_router = APIRouter(prefix="/admin", tags=["admin"])

admin_router.include_router(dashboard.router)
admin_router.include_router(users.router)
admin_router.include_router(categories.router)
admin_router.include_router(products.router)
admin_router.include_router(orders.router)
admin_router.include_router(reviews.router)

__all__ = ["admin_router"]
