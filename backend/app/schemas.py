from pydantic import BaseModel
from typing import Optional


class PromptRequest(BaseModel):
  prompt: str
  model: Optional[str]
  max_tokens: Optional[int] = 512
  temperature: Optional[float] = 0.7


class PromptResponse(BaseModel):
  id: Optional[str]
  prompt: str
  response: str
  model: Optional[str]
  createdAt: Optional[str]