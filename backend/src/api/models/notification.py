from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .user import User


class Notification(TimestampMixin, Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="info", nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    link: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user: Mapped["User"] = relationship(back_populates="notifications")
