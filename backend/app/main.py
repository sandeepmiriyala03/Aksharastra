from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://aksharastra.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Welcome to Aksharastra Backend!"}

@app.post("/generate-audio/")
async def generate_audio(text_input: TextInput):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")

    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    full_text = f"{text_input.text} [{current_datetime}] - Aksharastra-- Sandeep Miriyala"

    return {"message": full_text}
