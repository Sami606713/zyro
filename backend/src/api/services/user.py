from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.api.exceptions import BadRequestException, NotFoundException
from src.api.models import Address, User
from src.api.schemas.user import (
    AddressCreate,
    AddressUpdate,
    UserRegister,
    UserUpdate,
)
from src.api.utils.deps import get_password_hash


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.addresses))
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        result = await self.db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, user_data: UserRegister, password_hash: str) -> User:
        user = User(
            email=user_data.email,
            password_hash=password_hash,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            phone=user_data.phone,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update(self, user: User, user_data: UserUpdate) -> User:
        if user_data.first_name is not None:
            user.first_name = user_data.first_name
        if user_data.last_name is not None:
            user.last_name = user_data.last_name
        if user_data.phone is not None:
            user.phone = user_data.phone

        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, user_id: int) -> None:
        user = await self.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        await self.db.delete(user)
        await self.db.commit()

    async def change_password(
        self, user: User, current_password: str, new_password: str, verify_password
    ) -> None:
        if not verify_password(current_password, user.password_hash):
            raise BadRequestException("Current password is incorrect")

        user.password_hash = get_password_hash(new_password)
        await self.db.commit()

    async def create_address(
        self, user_id: int, address_data: AddressCreate
    ) -> Address:
        if address_data.is_default:
            await self.db.execute(
                Address.__table__.update()
                .where(Address.user_id == user_id)
                .values(is_default=False)
            )

        address = Address(user_id=user_id, **address_data.model_dump())
        self.db.add(address)
        await self.db.commit()
        await self.db.refresh(address)
        return address

    async def list_addresses(self, user_id: int) -> List[Address]:
        result = await self.db.execute(
            select(Address).where(Address.user_id == user_id)
        )
        return result.scalars().all()

    async def update_address(
        self, user_id: int, address_id: int, address_data: AddressUpdate
    ) -> Address:
        result = await self.db.execute(
            select(Address).where(
                Address.id == address_id, Address.user_id == user_id
            )
        )
        address = result.scalar_one_or_none()
        if not address:
            raise NotFoundException("Address not found")

        for field, value in address_data.model_dump(exclude_unset=True).items():
            setattr(address, field, value)

        if address_data.is_default:
            await self.db.execute(
                Address.__table__.update()
                .where(Address.user_id == user_id, Address.id != address_id)
                .values(is_default=False)
            )

        await self.db.commit()
        await self.db.refresh(address)
        return address

    async def delete_address(self, user_id: int, address_id: int) -> None:
        result = await self.db.execute(
            select(Address).where(
                Address.id == address_id, Address.user_id == user_id
            )
        )
        address = result.scalar_one_or_none()
        if not address:
            raise NotFoundException("Address not found")

        await self.db.delete(address)
        await self.db.commit()
