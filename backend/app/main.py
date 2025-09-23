from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pyttsx3
import tempfile
import os
import uuid


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
    voice_rate: float = 150
    voice_volume: float = 0.9


def remove_file(path: str):
    try:
        os.remove(path)
    except Exception:
        pass


@app.get("/")
async def root():
    return {"message": "Welcome to Aksharastra Backend!"}


@app.post("/generate-audio/")
async def generate_audio(text_input: TextInput, background_tasks: BackgroundTasks):
    if not text_input.text.strip():
        raise HTTPException(status_code=400, detail="Text input cannot be empty")

    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', text_input.voice_rate)
        engine.setProperty('volume', text_input.voice_volume)

        temp_dir = tempfile.gettempdir()
        audio_filename = f"speech_{uuid.uuid4().hex}.wav"
        audio_path = os.path.join(temp_dir, audio_filename)

        engine.save_to_file(text_input.text, audio_path)
        engine.runAndWait()

        if not os.path.exists(audio_path):
            raise HTTPException(status_code=500, detail="Failed to generate audio file")

        background_tasks.add_task(remove_file, audio_path)

        return FileResponse(
            path=audio_path,
            media_type='audio/wav',
            filename="aksharastra_speech.wav",
            headers={"Content-Disposition": "attachment"},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio generation failed: {str(e)}")
