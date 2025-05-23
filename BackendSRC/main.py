# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend (Amplify) to talk to backend (adjust origin accordingly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
def read_root():
    return {"message": "Hello from backend!"}
