from typing import TYPE_CHECKING, List

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .address import Address
    from .order_item import OrderItem
    from .user import User


class Order(TimestampMixin, Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), default="pending", nullable=False
    )
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    shipping_address_id: Mapped[int] = mapped_column(
        ForeignKey("addresses.id", ondelete="RESTRICT"), nullable=False
    )
    billing_address_id: Mapped[int] = mapped_column(
        ForeignKey("addresses.id", ondelete="RESTRICT"), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="orders")
    shipping_address: Mapped["Address"] = relationship(
        foreign_keys=[shipping_address_id]
    )
    billing_address: Mapped["Address"] = relationship(
        foreign_keys=[billing_address_id]
    )
    items: Mapped[List["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )
