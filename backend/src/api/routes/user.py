from typing import List

from fastapi import APIRouter, Depends, status, Query

from src.api.exceptions import (
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
)
from src.api.schemas.user import (
    AddressCreate,
    AddressResponse,
    AddressUpdate,
    ChangePassword,
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
    UserUpdate,
    PasswordResetRequest,
    PasswordResetConfirm,
    RefreshTokenRequest,
    TokenRefreshResponse,
)
from src.api.services.user import UserService
from src.api.utils.deps import (
    CurrentActiveUser,
    CurrentAdmin,
    DBDep,
    create_access_token,
    create_refresh_token,
    verify_refresh_token,
    get_password_hash,
    verify_password,
)

router = APIRouter(prefix="/users", tags=["users"])


def get_service(db: DBDep) -> UserService:
    return UserService(db)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    service: UserService = Depends(get_service),
):
    existing = await service.get_by_email(user_data.email)
    if existing:
        raise ConflictException("Email already registered")

    return await service.create(user_data, get_password_hash(user_data.password))


@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    service: UserService = Depends(get_service),
    db: DBDep = None,
):
    user = await service.get_by_email(credentials.email)

    if not user or not verify_password(credentials.password, user.password_hash):
        raise UnauthorizedException("Incorrect email or password")

    if not user.is_active:
        raise BadRequestException("User account is deactivated")

    access_token = await create_access_token(user.id, db)
    refresh_token = await create_refresh_token(user.id, db)
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    user = await service.get_by_id(current_user.id)
    return user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    return await service.update(current_user, user_data)


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    password_data: ChangePassword,
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    await service.change_password(
        current_user,
        password_data.current_password,
        password_data.new_password,
        verify_password,
    )


@router.get("", response_model=List[UserResponse])
async def list_users(
    current_admin: CurrentAdmin,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    service: UserService = Depends(get_service),
):
    return await service.list_users(skip, limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_admin: CurrentAdmin,
    service: UserService = Depends(get_service),
):
    user = await service.get_by_id(user_id)
    if not user:
        raise NotFoundException("User not found")
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_admin: CurrentAdmin,
    service: UserService = Depends(get_service),
):
    await service.delete(user_id)


@router.post("/me/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_address(
    address_data: AddressCreate,
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    return await service.create_address(current_user.id, address_data)


@router.get("/me/addresses", response_model=List[AddressResponse])
async def list_addresses(
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    return await service.list_addresses(current_user.id)


@router.put("/me/addresses/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: int,
    address_data: AddressUpdate,
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    return await service.update_address(current_user.id, address_id, address_data)


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(
    address_id: int,
    current_user: CurrentActiveUser,
    service: UserService = Depends(get_service),
):
    await service.delete_address(current_user.id, address_id)


@router.post("/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(
    data: PasswordResetRequest,
    service: UserService = Depends(get_service),
    db: DBDep = None,
):
    user = await service.get_by_email(data.email)
    if user:
        from src.api.utils.deps import create_password_reset_token
        token = await create_password_reset_token(user.id, db)
    return None


@router.post("/reset-password", status_code=status.HTTP_204_NO_CONTENT)
async def reset_password(
    data: PasswordResetConfirm,
    service: UserService = Depends(get_service),
    db: DBDep = None,
):
    from src.api.utils.deps import verify_password_reset_token
    user_id = await verify_password_reset_token(data.token, db)
    if not user_id:
        raise BadRequestException("Invalid or expired token")

    user = await service.get_by_id(user_id)
    if not user:
        raise NotFoundException("User not found")

    user.password_hash = get_password_hash(data.new_password)
    await db.commit()
    return None


@router.post("/refresh-token", response_model=TokenRefreshResponse)
async def refresh_token(
    data: RefreshTokenRequest,
    db: DBDep = None,
):
    user_id = await verify_refresh_token(data.refresh_token, db)
    if not user_id:
        raise UnauthorizedException("Invalid refresh token")

    access_token = await create_access_token(user_id, db)
    new_refresh_token = await create_refresh_token(user_id, db)
    return TokenRefreshResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
    )
