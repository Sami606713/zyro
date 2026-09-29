import time
from dataclasses import dataclass

@dataclass
class ZyroContext:
    token: str  # user's JWT from the frontend