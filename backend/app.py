from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
import faiss

app = FastAPI(title="Aksharastra Backend API")

# Allow CORS for frontend development (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VectorWithTextAndID(BaseModel):
    id: int
    text: str
    vector: List[float]

# Vector DB setup with 768-dimensional embeddings example
dimension = 768
index = faiss.IndexFlatL2(dimension)

# In-memory storage for texts and IDs (for demonstration purposes)
vector_text_db = {}

@app.get("/")
async def health_check():
    """Simple health check endpoint"""
    return {"message": "Aksharastra backend is running"}

@app.post("/add-vectors-with-text/")
async def add_vectors_with_text(items: List[VectorWithTextAndID]):
    """
    Add vectors with associated text and IDs,
    store vectors in FAISS index and text/ids in memory
    """
    vectors = [item.vector for item in items]
    texts = [item.text for item in items]
    ids = [item.id for item in items]

    vectors_np = np.array(vectors).astype('float32')

    if vectors_np.shape[1] != dimension:
        raise HTTPException(status_code=400, detail="Vectors have incorrect dimension.")

    index.add(vectors_np)

    # Store id->text/vector mapping in memory
    for item in items:
        vector_text_db[item.id] = {"text": item.text, "vector": item.vector}

    return {
        "message": "Vectors and texts with IDs added successfully",
        "num_vectors": index.ntotal,
        "received_ids": ids,
        "received_texts": texts
    }

@app.get("/vector-text/{id}")
async def get_vector_text(id: int):
    """Fetch stored text and vector by id"""
    if id not in vector_text_db:
        raise HTTPException(status_code=404, detail="Item not found")
    item = vector_text_db[id]
    # Safely convert vector to list if it's numpy array
    vector_list = item["vector"]
    if not isinstance(vector_list, list):
        vector_list = vector_list.tolist()
    return {"id": id, "text": item["text"], "vector": vector_list}

@app.get("/vector-texts/")
async def get_all_vector_texts():
    """Get all stored vector-text entries"""
    result = []
    for id, data in vector_text_db.items():
        vector_list = data["vector"]
        if not isinstance(vector_list, list):
            vector_list = vector_list.tolist()
        result.append({"id": id, "text": data["text"], "vector": vector_list})
    return result
