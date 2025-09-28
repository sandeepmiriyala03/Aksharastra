import faiss
import numpy as np

class VectorDB:
    def __init__(self, dimension=768):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)

    def add_vectors(self, vectors: list[list[float]]):
        vectors_np = np.array(vectors).astype('float32')
        if vectors_np.shape[1] != self.dimension:
            raise ValueError("Vectors have incorrect dimension.")
        self.index.add(vectors_np)

    def search_vectors(self, query: list[float], k=5):
        query_np = np.array([query]).astype('float32')
        if query_np.shape[1] != self.dimension:
            raise ValueError("Query vector has incorrect dimension.")
        distances, indices = self.index.search(query_np, k)
        return distances.tolist(), indices.tolist()
