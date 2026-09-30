from fastapi import APIRouter, Depends, status
from pydantic import BaseModel

from src.api.utils.deps import CurrentAdmin

router = APIRouter()


class SettingsUpdate(BaseModel):
    store_name: str | None = None
    store_email: str | None = None
    store_phone: str | None = None
    store_address: str | None = None
    currency: str | None = None
    tax_rate: float | None = None
    free_shipping_threshold: float | None = None
    shipping_fee: float | None = None


class SettingsResponse(BaseModel):
    store_name: str = "Zyro"
    store_email: str = "hello@zyro.com"
    store_phone: str = "+92 300 1234567"
    store_address: str = "Haripur, Pakistan"
    currency: str = "PKR"
    tax_rate: float = 0.0
    free_shipping_threshold: float = 5000.0
    shipping_fee: float = 200.0


@router.get("/settings", response_model=SettingsResponse)
async def get_settings(
    current_admin: CurrentAdmin,
):
    return SettingsResponse()


@router.put("/settings", response_model=SettingsResponse)
async def update_settings(
    data: SettingsUpdate,
    current_admin: CurrentAdmin,
):
    return SettingsResponse(**data.model_dump(exclude_unset=True))
