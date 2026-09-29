from langchain.agents import create_agent
from langchain_openai import ChatOpenAI
from langchain.mcp import MCPAdapter
from src.agent.context.context import ZyroContext
from dotenv import load_dotenv
import os
import asyncio

load_dotenv()

async def create_zyro_agent():
    model = ChatOpenAI(
        base_url="https://apihub.agnes-ai.com/v1",
        api_key=os.getenv("AGNES_API_KEY"),
        model="agnes-3.0-flash",
    )
    agent = create_agent(
        model=model,
        # tools=tools,
        system_prompt="You are a helpful assistant who help zyro customers zyro is a clothing brand.",
        context_schema=ZyroContext
    )
    return agent




zyro_agent = asyncio.run(create_zyro_agent())


if __name__ == "__main__":
    print("Running agent...")
    response = asyncio.run(zyro_agent.ainvoke({
        "messages": [
            {
                "role": "user",
                "content": "show me  all the orders"
            }
        ]
    }))
    print("Response: ", response)
