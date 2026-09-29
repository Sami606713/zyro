from fastapi import APIRouter

from .admin import admin_router
from .cart import router as cart_router
from .coupons import router as coupons_router
from .notifications import router as notifications_router
from .orders import router as orders_router
from .returns import router as returns_router
from .storefront import router as storefront_router
from .user import router as user_router
from .wishlist import router as wishlist_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(user_router)
api_router.include_router(admin_router)
api_router.include_router(storefront_router)
api_router.include_router(orders_router)
api_router.include_router(cart_router)
api_router.include_router(wishlist_router)
api_router.include_router(coupons_router)
api_router.include_router(returns_router)
api_router.include_router(notifications_router)

__all__ = ["api_router"]
