from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastmcp import FastMCP
from fastmcp.server.auth.providers.jwt import JWTVerifier
from src.api.utils.deps import get_mcp_auth
from src.api.routes import api_router

import uvicorn
import time


app = FastAPI(
    title="Zyro API",
    description="Backend API for Zyro clothing store",
    version="1.0.0",
)


_rate_limit_store: dict[str, list[float]] = {}
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 60


@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    if client_ip not in _rate_limit_store:
        _rate_limit_store[client_ip] = []

    _rate_limit_store[client_ip] = [
        t for t in _rate_limit_store[client_ip] if now - t < RATE_LIMIT_WINDOW
    ]

    if len(_rate_limit_store[client_ip]) >= RATE_LIMIT_REQUESTS:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again later."},
        )

    _rate_limit_store[client_ip].append(now)
    return await call_next(request)


_CORS_KWARGS = dict(
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=(
        r"http://("
        r"localhost|127\.0\.0\.1|"
        r"192\.168\.\d{1,3}\.\d{1,3}|"
        r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}"
        r")(:\d+)?"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.add_middleware(CORSMiddleware, **_CORS_KWARGS)


@app.middleware("http")
async def cors_error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )


app.include_router(api_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


mcp = FastMCP.from_fastapi(
    app=app,
    name="Zyro MCP",
    auth=get_mcp_auth()
)

mcp_app = mcp.http_app(
    path="/mcp",
)


combined_app = FastAPI(
    title="Zyro — Combined",
    routes=[
        *mcp_app.routes,
        *app.routes,
    ],
    lifespan=mcp_app.lifespan,
)

combined_app.add_middleware(CORSMiddleware, **_CORS_KWARGS)


if __name__ == "__main__":
    uvicorn.run(
        combined_app,
        host="0.0.0.0",
        port=8000,
    )
