# KathaGPT v2

An AI-powered document analysis and chat application that helps users extract, understand, and interact with information from various types of documents using Google's Gemini AI.

## Features

- **Document Upload & Analysis**
  - Support for multiple document types (receipts, menus, forms, invoices, etc.)
  - Automatic document type detection
  - Smart title generation based on content
  - Image optimization and processing
  - High-quality text extraction using Gemini AI

- **Interactive Chat**
  - Context-aware document conversations
  - Intelligent information extraction
  - Web search integration for enhanced responses
  - Support for complex queries about document content
  - Markdown formatting for clear responses

- **Document Management**
  - Advanced search capabilities
  - Document categorization
  - Chat history tracking
  - Document stats and metrics
  - Bulk operations support

- **Smart Search**
  - Full-text search across documents
  - Real-time search suggestions
  - Search result highlighting
  - Relevance-based sorting

## Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for building APIs
- **MongoDB**: NoSQL database for flexible document storage
- **Google Gemini AI**: Advanced AI model for text extraction and chat
- **PIL**: Image processing and optimization
- **BeautifulSoup4**: Web scraping for enhanced responses
- **Python-Multipart**: File upload handling
- **Uvicorn**: ASGI server implementation

### Frontend
- **React**: UI component library
- **Material-UI**: Modern React component framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **React Markdown**: Markdown rendering
- **Remark/Rehype**: Markdown processing plugins

## Project Structure

```
KathaGPTv2/
├── backend/
│   ├── app/
│   │   ├── config.py           # Configuration settings
│   │   ├── database.py         # Database connection
│   │   ├── main.py            # Application entry point
│   │   ├── models/            # Database models
│   │   │   ├── chat.py        # Chat message model
│   │   │   └── document.py    # Document model
│   │   ├── routes/            # API endpoints
│   │   │   ├── chat.py        # Chat endpoints
│   │   │   └── documents.py   # Document endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── chat_service.py
│   │   │   ├── document_service.py
│   │   │   └── gemini_service.py
│   │   └── utils/             # Helper functions
│   │       ├── db_utils.py
│   │       ├── image_utils.py
│   │       └── search_utils.py
│   └── requirements.txt
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    ├── src/
    │   ├── components/
    │   │   ├── chat/
    │   │   ├── common/
    │   │   └── documents/
    │   ├── pages/
    │   ├── services/
    │   └── styles/
    ├── package.json
    └── .env
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB 4.4+
- Google Gemini API key

### Backend Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Configure environment variables in `.env`:
```
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=kathagptv2
```

4. Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment in `.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

3. Start development server:
```bash
npm start
```

## API Documentation

### Core Endpoints

- **Documents**
  - `POST /api/v1/documents`: Upload new document
  - `GET /api/v1/documents`: List all documents
  - `GET /api/v1/documents/{id}`: Get document details
  - `DELETE /api/v1/documents/{id}`: Delete document

- **Chat**
  - `POST /api/v1/chat`: Send chat message
  - `GET /api/v1/chat/{document_id}`: Get chat history
  - `DELETE /api/v1/chat/{document_id}`: Clear chat history

Full API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Usage Examples

### Document Upload
```javascript
const formData = new FormData();
formData.append('file', documentFile);

const response = await axios.post('/api/v1/documents', formData);
const documentId = response.data._id;
```

### Chat Interaction
```javascript
const message = {
  document_id: documentId,
  user_message: "What is the total amount on this receipt?"
};

const response = await axios.post('/api/v1/chat', message);
const aiResponse = response.data.ai_response;
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Create Pull Request

## Error Handling

The application includes comprehensive error handling:
- Image validation and optimization
- API error responses with detailed messages
- Frontend error boundaries
- Network error handling
- Input validation

## Security Features

- Input sanitization
- Image validation
- Markdown sanitization
- API rate limiting
- Error message sanitization

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

