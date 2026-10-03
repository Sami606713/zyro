To run:
cd backend/src/voice/server
cp .env.example .env
# edit .env with your API keys
uv run bot.py              # run with SmallWebRTC at http://localhost:7860
uv run bot.py -t eval      # headless for evals
# in another terminal:
uv run pipecat eval run evals/zyro_starter_text.yaml -v
Deploy to Pipecat Cloud:
pipecat cloud auth login
pipecat cloud secrets set zyro-voice-secrets --file .env
pipecat cloud deploy --yes