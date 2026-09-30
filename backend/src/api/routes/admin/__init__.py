from fastapi import APIRouter

from . import categories, coupons, dashboard, orders, products, reviews, settings, users, user_detail

admin_router = APIRouter(prefix="/admin", tags=["admin"])

admin_router.include_router(dashboard.router)
admin_router.include_router(users.router)
admin_router.include_router(user_detail.router)
admin_router.include_router(categories.router)
admin_router.include_router(products.router)
admin_router.include_router(orders.router)
admin_router.include_router(reviews.router)
admin_router.include_router(coupons.router)
admin_router.include_router(settings.router)

__all__ = ["admin_router"]
