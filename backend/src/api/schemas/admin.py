from datetime import datetime
from typing import List

from pydantic import BaseModel, EmailStr, Field


class DashboardStats(BaseModel):
    users_count: int
    orders_count: int
    revenue: float
    products_count: int
    recent_orders: List["OrderBrief"] = []


class OrderBrief(BaseModel):
    id: int
    user_email: EmailStr
    status: str
    total_amount: float
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminUserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    is_active: bool | None = None


class AdminUserRoleUpdate(BaseModel):
    role_ids: List[int]


class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    parent_id: int | None = None


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    parent_id: int | None = None


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    base_price: float = Field(gt=0)
    category_id: int | None = None
    meta_title: str | None = None
    meta_description: str | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    base_price: float | None = Field(default=None, gt=0)
    category_id: int | None = None
    meta_title: str | None = None
    meta_description: str | None = None


class ProductStatusUpdate(BaseModel):
    is_active: bool


class VariantCreate(BaseModel):
    size: str
    color: str
    sku: str
    stock_quantity: int = Field(ge=0)
    price_override: float | None = Field(default=None, gt=0)


class VariantUpdate(BaseModel):
    size: str | None = None
    color: str | None = None
    sku: str | None = None
    stock_quantity: int | None = Field(default=None, ge=0)
    price_override: float | None = Field(default=None, gt=0)


class ImageUpdate(BaseModel):
    alt_text: str | None = None
    is_primary: bool | None = None
    sort_order: int | None = None


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|confirmed|shipped|delivered|cancelled)$")


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    parent_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None
    base_price: float
    category_id: int | None
    is_active: bool
    meta_title: str | None = None
    meta_description: str | None = None
    created_at: datetime
    updated_at: datetime
    images: list["ProductImageResponse"] = []
    variants: list["ProductVariantResponse"] = []
    average_rating: float | None = None
    review_count: int = 0

    model_config = {"from_attributes": True}


class ProductImageResponse(BaseModel):
    id: int
    product_id: int
    image_url: str
    alt_text: str | None
    is_primary: bool
    sort_order: int

    model_config = {"from_attributes": True}


class ProductVariantResponse(BaseModel):
    id: int
    product_id: int
    size: str
    color: str
    sku: str
    stock_quantity: int
    price_override: float | None

    model_config = {"from_attributes": True}


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    variant_id: int
    quantity: int
    unit_price: float
    total_price: float
    product_name: str | None = None

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    shipping_address_id: int
    billing_address_id: int
    created_at: datetime
    updated_at: datetime
    user: "UserBriefResponse | None" = None
    items: list["OrderItemResponse"] = []

    model_config = {"from_attributes": True}


class UserBriefResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str

    model_config = {"from_attributes": True}


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    variant_id: int
    quantity: int
    unit_price: float
    total_price: float

    model_config = {"from_attributes": True}


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    title: str | None
    comment: str | None
    created_at: datetime
    updated_at: datetime
    user: UserBriefResponse | None = None
    product: "ProductBriefResponse | None" = None

    model_config = {"from_attributes": True}


class ProductBriefResponse(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class CouponCreate(BaseModel):
    code: str
    discount_percent: float = Field(gt=0, le=100)
    valid_from: datetime
    valid_until: datetime
    usage_limit: int | None = None


class CouponUpdate(BaseModel):
    code: str | None = None
    discount_percent: float | None = Field(default=None, gt=0, le=100)
    valid_from: datetime | None = None
    valid_until: datetime | None = None
    is_active: bool | None = None
    usage_limit: int | None = None


class CouponResponse(BaseModel):
    id: int
    code: str
    discount_percent: float
    valid_from: datetime
    valid_until: datetime
    is_active: bool
    usage_limit: int | None
    usage_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserDetailResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    phone: str | None
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime
    addresses: list["AddressResponse"] = []
    orders: list["OrderResponse"] = []

    model_config = {"from_attributes": True}


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
