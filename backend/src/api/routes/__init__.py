from fastapi import APIRouter

from .admin import admin_router
from .orders import router as orders_router
from .storefront import router as storefront_router
from .user import router as user_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(user_router)
api_router.include_router(admin_router)
api_router.include_router(storefront_router)
api_router.include_router(orders_router)

__all__ = ["api_router"]
