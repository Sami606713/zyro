from fastapi import APIRouter, Depends, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.exceptions import NotFoundException
from src.api.models import Notification
from src.api.utils.deps import CurrentActiveUser, DBDep

router = APIRouter()


@router.get("/notifications")
async def get_notifications(
    current_user: CurrentActiveUser,
    db: DBDep,
    skip: int = 0,
    limit: int = 20,
    unread_only: bool = False,
):
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)

    count_query = select(func.count(Notification.id)).where(
        Notification.user_id == current_user.id
    )
    if unread_only:
        count_query = count_query.where(Notification.is_read == False)

    total = await db.scalar(count_query)

    query = query.order_by(Notification.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    notifications = result.scalars().all()

    return {
        "items": notifications,
        "total": total,
        "skip": skip,
        "limit": limit,
        "has_more": (skip + limit) < total,
    }


@router.get("/notifications/unread-count")
async def get_unread_count(
    current_user: CurrentActiveUser,
    db: DBDep,
):
    result = await db.execute(
        select(func.count(Notification.id)).where(
            Notification.user_id == current_user.id,
            Notification.is_read == False,
        )
    )
    return {"count": result.scalar()}


@router.put("/notifications/{notification_id}/read")
async def mark_as_read(
    notification_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    notification = await db.get(Notification, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise NotFoundException("Notification not found")
    notification.is_read = True
    await db.commit()
    return {"message": "Notification marked as read"}


@router.put("/notifications/read-all")
async def mark_all_as_read(
    current_user: CurrentActiveUser,
    db: DBDep,
):
    await db.execute(
        Notification.__table__.update()
        .where(Notification.user_id == current_user.id)
        .values(is_read=True)
    )
    await db.commit()
    return {"message": "All notifications marked as read"}


@router.delete("/notifications/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    current_user: CurrentActiveUser,
    db: DBDep,
):
    notification = await db.get(Notification, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise NotFoundException("Notification not found")
    await db.delete(notification)
    await db.commit()
