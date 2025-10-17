
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import importlib
import importlib.util
from typing import Optional, Any
from .schemas import PromptRequest, PromptResponse
import traceback

# Optional: load environment variables from a local `.env` file in the backend
# directory to make local development easier (for example, setting OPENAI_API_KEY).
try:
    # python-dotenv is included in requirements.txt; only load if available
    from dotenv import load_dotenv
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    env_path = os.path.join(BASE_DIR, '.env')
    if os.path.exists(env_path):
        load_dotenv(env_path)
except Exception:
    # dotenv is optional; ignore if it's not installed or loading fails
    pass



# Use new OpenAI client (>=1.0.0)
import openai


app = FastAPI(title="AI WebApp API")

# Allow CORS from local dev origin and any production origin you will deploy from
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:5173", "*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.post("/api/generate", response_model=PromptResponse)
async def generate(req: PromptRequest):
    """Generate a response from OpenAI (chat completion) using the new client."""
    prompt = req.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt empty")
    model = req.model or "gpt-4o"

    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY environment variable not set")

    try:
        openai_client = openai.OpenAI(api_key=key)
        completion = openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=req.max_tokens or 512,
            temperature=req.temperature or 0.7,
        )
        # New client: response is an object, choices is a list of objects
        text = completion.choices[0].message.content if completion.choices else ""
        return PromptResponse(
            id=completion.id,
            prompt=prompt,
            response=text.strip(),
            model=model,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")


@app.post("/api/generate-image")
async def generate_image(data: PromptRequest):
    model = data.model or "dall-e-3"
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY environment variable not set")

    try:
        openai_client = openai.OpenAI(api_key=key)
        response = openai_client.images.generate(
            model=model,
            prompt=data.prompt,
            n=1,
            size="1024x1024"
        )
        image_url = response.data[0].url if response.data and len(response.data) > 0 else None
        return {
            "image_url": image_url,
            "id": getattr(response, "id", None),
            "prompt": data.prompt,
            "model": model,
        }
    except Exception as e:
        return {"image_url": f"Error: {str(e)}"}