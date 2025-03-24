# KhataGPT Backend

Python FastAPI backend for KhataGPT document analysis system powered by Gemini AI.

## Technology Stack

- **FastAPI**: Modern Python web framework for building APIs
- **MongoDB**: NoSQL database for document storage
- **Google Gemini AI**: Latest AI model for text extraction and chat
- **PIL**: Image processing library
- **BeautifulSoup4**: Web scraping for enhanced responses
- **Python-Multipart**: File upload handling
- **Uvicorn**: ASGI server

## Project Structure

```
backend/
├── app/
│   ├── config.py           # Configuration settings
│   ├── database.py         # MongoDB connection
│   ├── main.py            # Application entry point
│   ├── models/            # Database models
│   │   ├── chat.py        # Chat message model
│   │   └── document.py    # Document model
│   ├── routes/            # API endpoints
│   │   ├── chat.py        # Chat endpoints
│   │   └── documents.py   # Document endpoints
│   ├── services/          # Business logic
│   │   ├── chat_service.py
│   │   ├── document_processor.py
│   │   ├── document_service.py
│   │   └── gemini_service.py
│   └── utils/             # Helper functions
│       ├── db_utils.py
│       ├── image_utils.py
│       └── search_utils.py
└── requirements.txt
```

## Setup Instructions

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=KhataGPTv2
```

4. Start MongoDB server (make sure MongoDB is installed)

5. Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

### Documents API

#### Upload Document
```http
POST /api/v1/documents
Content-Type: multipart/form-data

file: <document_image>
```

#### List Documents
```http
GET /api/v1/documents
```

Query Parameters:
- `search`: Optional search term

#### Get Document
```http
GET /api/v1/documents/{document_id}
```

#### Delete Document
```http
DELETE /api/v1/documents/{document_id}
```

### Chat API

#### Send Message
```http
POST /api/v1/chat
Content-Type: application/json

{
  "document_id": "string",
  "user_message": "string"
}
```

#### Get Chat History
```http
GET /api/v1/chat/{document_id}
```

#### Clear Chat History
```http
DELETE /api/v1/chat/{document_id}
```

## Features

### Document Processing
- Automatic document type detection
- High-quality text extraction using Gemini AI
- Smart title generation
- Image optimization
- Base64 image encoding
- Document search capability

### Chat System
- Context-aware document conversations
- Web search integration for enhanced responses
- Markdown formatting support
- Chat history tracking
- Tool usage tracking

### Image Processing
- Format conversion to JPG
- Image resizing
- Quality optimization
- Base64 encoding/decoding

### Search Integration
- DuckDuckGo web search
- Search result parsing
- Context-aware query generation

## Error Handling

The API includes comprehensive error handling:
- Input validation
- File type verification
- Size limits
- Database connection errors
- AI processing errors

## Development

### Adding New Routes
1. Create route file in `app/routes/`
2. Define endpoints using FastAPI decorators
3. Include router in `main.py`

### Database Models
1. Define Pydantic models in `app/models/`
2. Add MongoDB interface methods
3. Include validation and type hints

### Services
1. Add business logic in `app/services/`
2. Keep services focused and modular
3. Handle errors appropriately

## Testing

Run tests using pytest:
```bash
pytest
```

## Deployment

1. Build Docker image:
```bash
docker build -t KhataGPT-backend .
```

2. Run container:
```bash
docker run -p 8000:8000 KhataGPT-backend
```

## API Documentation UI

Access interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
