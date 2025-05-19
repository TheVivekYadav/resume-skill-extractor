from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .routes.api import router
from .middleware.logging import LoggingMiddleware
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title=os.getenv("APP_NAME", "FastAPI Backend"),
    version=os.getenv("API_VERSION", "v1")
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:3000","https://fanciful-pegasus-94e695.netlify.app","http://localhost:8000"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Add logging middleware
app.add_middleware(LoggingMiddleware)
# Include routes
app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "message": "Hello World from FastAPI!",
        "app_name": os.getenv("APP_NAME", "FastAPI Backend"),
        "version": os.getenv("API_VERSION", "v1")
    } 
