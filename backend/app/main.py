from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ai

app = FastAPI(title="GenAI Test Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "GenAI Test Platform API is running 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}