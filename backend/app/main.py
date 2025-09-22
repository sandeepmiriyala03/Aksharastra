from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",     # React frontend URL (default Vite dev server)
    "http://127.0.0.1:5173",     # Also include this if you access frontend via this URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],           # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],           # Allow all headers
)

# Your existing API routes below
@app.get("/")
async def root():
    return {"message": "Welcome to Aksharastra Backend!"}
