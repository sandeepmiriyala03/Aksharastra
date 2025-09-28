import json

data = [
    {
        "id": 1,
        "text": "This is a sample Sanskrit text.",
        "vector": [0.1] * 768
    },
    {
        "id": 2,
        "text": "This is another sample Telugu verse.",
        "vector": [0.2] * 768
    }
]

print(json.dumps(data))
