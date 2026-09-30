from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .order import Order
    from .user import User


class ReturnRequest(TimestampMixin, Base):
    __tablename__ = "return_requests"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), default="pending", nullable=False
    )
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    order: Mapped["Order"] = relationship(back_populates="return_requests")
    user: Mapped["User"] = relationship(back_populates="return_requests")
