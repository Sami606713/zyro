FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:python3.11-bookworm-slim /uv /uvx /bin/

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS runner

WORKDIR /app

COPY --from=builder /app/.venv ./.venv
COPY --from=builder /usr/local/bin/uv /usr/local/bin/uv

COPY alembic/ ./alembic/
COPY alembic.ini ./
COPY langgraph.json ./
COPY scripts/ ./scripts/
COPY src/ ./src/

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "src.api.main:combined_app", "--host", "0.0.0.0", "--port", "8000"]
