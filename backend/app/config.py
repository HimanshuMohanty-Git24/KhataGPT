import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Frontend configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# API configuration
API_PREFIX = "/api/v1"
DEBUG = os.getenv("DEBUG", "False").lower() in ["true", "1", "t"]

# MongoDB configuration
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "kathagptv2")

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# File uploads
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf"}  # Add pdf here

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)