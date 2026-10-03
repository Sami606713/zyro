FROM python:3.11-slim

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN pip install --no-cache-dir uv

# Install pipecat-ai and dependencies
RUN uv pip install --system --no-cache "pipecat-ai[cartesia,deepgram,evals,openai,runner,silero,webrtc]>=1.12.0" "pipecatcloud"

# Copy the application code
COPY ./bot.py bot.py
COPY ./evals ./evals

# Run the bot
CMD ["python", "bot.py"]