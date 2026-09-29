from datetime import datetime
from typing import List

from pydantic import BaseModel, EmailStr, Field, field_validator


class AddressCreate(BaseModel):
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    postal_code: str
    country: str
    phone: str | None = None
    is_default: bool = False

    @field_validator("postal_code")
    @classmethod
    def validate_postal_code(cls, v):
        if not v.isdigit() or len(v) < 4 or len(v) > 10:
            raise ValueError("Postal code must be 4-10 digits")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        if v and (not v.replace("+", "").replace("-", "").replace(" ", "").isdigit()):
            raise ValueError("Phone number must contain only digits, +, -, or spaces")
        return v


class AddressUpdate(BaseModel):
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str | None = None
    phone: str | None = None
    is_default: bool | None = None


class AddressResponse(BaseModel):
    id: int
    address_line1: str
    address_line2: str | None
    city: str
    state: str
    postal_code: str
    country: str
    phone: str | None
    is_default: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    first_name: str
    last_name: str
    phone: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    addresses: List["AddressResponse"] = []

    model_config = {"from_attributes": True}


class UserDetailResponse(UserResponse):
    addresses: List[AddressResponse] = []


class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8)


class Token(BaseModel):
    access_token: str
    refresh_token: str | None = None
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: int
    roles: list[str] = []


class OrderItemCreate(BaseModel):
    variant_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(min_length=1)
    shipping_address_id: int = Field(gt=0)
    billing_address_id: int | None = None
    coupon_code: str | None = None
    notes: str | None = None


class GuestOrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(min_length=1)
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None = None
    shipping_address: AddressCreate
    billing_address: AddressCreate | None = None
    coupon_code: str | None = None
    notes: str | None = None


class OrderItemResponse(BaseModel):
    id: int
    variant_id: int
    quantity: int
    unit_price: float
    total_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    user_id: int | None
    status: str
    total_amount: float
    shipping_address_id: int
    billing_address_id: int
    notes: str | None
    guest_email: str | None = None
    guest_first_name: str | None = None
    guest_last_name: str | None = None
    guest_phone: str | None = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    product_id: int | None = None
    rating: int = Field(ge=1, le=5)
    title: str | None = None
    comment: str | None = None


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    title: str | None
    comment: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CartItemCreate(BaseModel):
    variant_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class CartItemUpdate(BaseModel):
    quantity: int = Field(gt=0)


class CartItemResponse(BaseModel):
    id: int
    variant_id: int
    quantity: int
    product_name: str
    product_slug: str
    size: str
    color: str
    sku: str
    unit_price: float
    total_price: float
    image_url: str | None = None

    model_config = {"from_attributes": True}


class CartResponse(BaseModel):
    id: int
    items: List[CartItemResponse] = []
    total_amount: float
    total_items: int

    model_config = {"from_attributes": True}


class WishlistItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_slug: str
    base_price: float
    image_url: str | None

    model_config = {"from_attributes": True}


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenRefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
