FROM python:3.14-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install --no-cache-dir uv

# Copy project files
COPY . .

# Install dependencies using uv
RUN PYTHONDONTWRITEBYTECODE=1 uv pip install --system --no-cache-dir -e .

# Set environment variables for LangGraph
ENV LANGGRAPH_HTTP='{"app": "src.api.main:combined_app"}'
ENV LANGSERVE_GRAPHS='{"chat": "src.agent.agent:zyro_agent"}'
ENV PYTHONUNBUFFERED=1

# Expose port (Railway will override this)
EXPOSE 8000

# Start the app
CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]

