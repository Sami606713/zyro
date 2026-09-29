import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Annotated

import bcrypt
from dotenv import load_dotenv
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from fastmcp.server.auth.providers.jwt import JWTVerifier
from src.api.exceptions import (
    AdminRequiredException,
    CredentialsException,
    InactiveUserException,
)
from src.api.models import Role, User, UserRole

BACKEND_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(BACKEND_ROOT / ".env")

DATABASE_URL = os.getenv("POSTGRES_URI_CUSTOM")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

engine = create_async_engine(DATABASE_URL, echo=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")


async def get_db():
    async with async_session() as session:
        yield session


DBDep = Annotated[AsyncSession, Depends(get_db)]


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


async def create_access_token(user_id: int, db: AsyncSession) -> str:
    result = await db.execute(
        select(Role.name)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == user_id)
    )
    roles = [row[0] for row in result.all()]

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user_id), "roles": roles, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: DBDep,
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
        if user_id is None:
            raise CredentialsException()
    except JWTError:
        raise CredentialsException()

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise CredentialsException()
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_active_user(
    current_user: CurrentUser,
) -> User:
    if not current_user.is_active:
        raise InactiveUserException()
    return current_user


CurrentActiveUser = Annotated[User, Depends(get_current_active_user)]


async def get_current_admin(
    current_user: CurrentActiveUser,
    db: DBDep,
) -> User:
    result = await db.execute(
        select(Role)
        .join(UserRole, UserRole.role_id == Role.id)
        .where(UserRole.user_id == current_user.id, Role.name == "admin")
    )
    if not result.scalar_one_or_none():
        raise AdminRequiredException()
    return current_user

def get_mcp_auth():
    auth = JWTVerifier(
        public_key=SECRET_KEY,     
        algorithm=ALGORITHM,       
        audience=None,             
    )
    return auth

CurrentAdmin = Annotated[User, Depends(get_current_admin)]
