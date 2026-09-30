from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class Coupon(TimestampMixin, Base):
    __tablename__ = "coupons"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    discount_percent: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    valid_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    usage_limit: Mapped[int | None] = mapped_column(nullable=True)
    usage_count: Mapped[int] = mapped_column(default=0, nullable=False)
