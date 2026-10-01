# Make the mcp of the applications
from fastmcp.server.auth.providers.jwt import JWTVerifier
# from src.api.utils.deps import get_mcp_auth
from fastmcp import FastMCP
from src.api.main import app



# Convert to MCP server
mcp = FastMCP.from_fastapi(app=app)

if __name__ == "__main__":
    mcp.run(
    transport="http",
    host="0.0.0.0",
    port=8001,
)
