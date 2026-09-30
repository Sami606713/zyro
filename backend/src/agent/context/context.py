import time
from dataclasses import dataclass, field

@dataclass
class ZyroContext:
    token: str = ""  # user's JWT from the frontend (empty for guest users)