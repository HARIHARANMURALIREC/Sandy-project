from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import os
from contextlib import asynccontextmanager

from database import engine, create_tables
from routers import auth, legal_topics, quizzes, ai_assistant


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    yield
    # Shutdown


app = FastAPI(
    title="Rights 360 API",
    description="Legal Literacy and Empowerment Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(legal_topics.router, prefix="/api/legal", tags=["legal-topics"])
app.include_router(quizzes.router, prefix="/api/quiz", tags=["quizzes"])
app.include_router(ai_assistant.router, prefix="/api/ai", tags=["ai-assistant"])


@app.get("/")
async def root():
    return {
        "message": "Rights 360 API",
        "status": "active",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
