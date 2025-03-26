from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.routes.documents import router as documents_router
from app.routes.chat import router as chat_router
from app.config import API_PREFIX, FRONTEND_URL

# Create FastAPI app
app = FastAPI(
    title="KhataGPT API",
    description="API for document analysis and chat using Gemini AI",
    version="2.0.0"
)

# Configure CORS properly
origins = [
    FRONTEND_URL,
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with explicit prefixes
app.include_router(documents_router, prefix=f"{API_PREFIX}/documents")
app.include_router(chat_router, prefix=f"{API_PREFIX}/chat")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to KhataGPT API", 
        "version": "2.0.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)