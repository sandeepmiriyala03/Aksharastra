from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


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

@app.post("/echo/")
async def echo_text(text_input: TextInput):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")
    return {"echoed_text": text_input.text}

@app.get("/health/")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/reverse-text/")
async def reverse_text(text_input: TextInput):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")
    reversed_text = text_input.text[::-1]
    return {"reversed_text": reversed_text}

@app.post("/capitalize-text/")
async def capitalize_text(text_input: TextInput):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")
    capitalized = text_input.text.upper()
    return {"capitalized_text": capitalized}

@app.post("/word-count/")
async def word_count(text_input: TextInput, min_length: Optional[int] = Query(1, ge=1, le=10)):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")
    words = [word for word in text_input.text.split() if len(word) >= min_length]
    count = len(words)
    return {"word_count": count, "min_length_filter": min_length}

@app.post("/tokenize/")
async def tokenize_text(text_input: TextInput):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")
    tokens = text_input.text.split()
    return {"tokens": tokens}
