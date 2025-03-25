<div align="center">

# KhathaGPT Backend

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python_3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg?style=for-the-badge)](https://github.com/psf/black)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Modern API backend for intelligent document analysis powered by Google's Gemini AI

[Getting Started](#-getting-started) • 
[Features](#-features) •
[Contributing](#-contributing)

</div>

---

## 📖 Overview

KhathaGPT's backend is built with FastAPI and MongoDB, leveraging Google's Gemini AI for advanced document analysis. It provides robust APIs for document processing, intelligent chat, and search capabilities.

## 🛠️ Technology Stack

- **FastAPI**: High-performance web framework
- **MongoDB**: Scalable document database
- **Google Gemini AI**: State-of-the-art AI model
- **Pillow**: Image processing
- **BeautifulSoup4**: Web content parsing
- **Python-Multipart**: File handling
- **Uvicorn**: Lightning-fast ASGI server
- **pytest**: Testing framework
- **Docker**: Containerization

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── config/           # Configuration and settings
│   │   ├── __init__.py
│   │   └── settings.py
│   ├── core/            # Core functionality
│   │   ├── security.py
│   │   └── errors.py
│   ├── models/          # Data models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── utils/           # Helper functions
├── tests/               # Test suites
├── docker/             # Docker configuration
├── .env.example        # Environment template
├── Dockerfile          # Docker build file
├── docker-compose.yml  # Docker compose config
├── requirements.txt    # Dependencies
└── README.md          # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- MongoDB 4.4+
- Google Gemini API key
- Docker (optional)

### Local Development Setup

1. Clone and setup virtual environment:
```bash
git clone https://github.com/KhataGPT/KhathaGPT.git
cd KhathaGPT/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Start the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Setup

```bash
# Build and run using Docker
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 📚 API Documentation

### Authentication

All API endpoints require authentication using Bearer token:
```http
Authorization: Bearer <your_token>
```

### Documents API

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/documents` | POST | Upload document | Required |
| `/api/v1/documents` | GET | List documents | Required |
| `/api/v1/documents/{id}` | GET | Get document | Required |
| `/api/v1/documents/{id}` | DELETE | Delete document | Required |

### Chat API

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/v1/chat` | POST | Send message | Required |
| `/api/v1/chat/{id}` | GET | Get chat history | Required |
| `/api/v1/chat/{id}` | DELETE | Clear chat history | Required |


## ✨ Features

### Document Intelligence
- 🤖 AI-powered text extraction
- 📝 Smart document classification
- 🔍 Full-text search capability
- 🖼️ Advanced image processing
- 📊 Metadata generation

### Chat System
- 💬 Context-aware conversations
- 🌐 Web search integration
- ✍️ Markdown formatting
- 📝 History tracking
- 🛠️ Tool integration

### Security
- 🔒 JWT authentication
- 🛡️ Rate limiting
- ✅ Input validation
- 🔐 Data encryption
- 📝 Audit logging

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Generate coverage report
pytest --cov=app --cov-report=html
```

## 🚢 Deployment

### Production Setup

1. Configure production settings:
```bash
export ENVIRONMENT=production
export API_KEY=your-secret-key
```

2. Build optimized container:
```bash
docker build -t khathagpt-backend:prod -f docker/Dockerfile.prod .
```

3. Run in production:
```bash
docker run -d -p 8000:8000 khathagpt-backend:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open pull request

## 📄 License

MIT License - see [LICENSE](LICENSE)

## 💬 Support

- 💻 [GitHub Issues](https://github.com/KhataGPT/KhathaGPT/issues)

---

<div align="center">

Made with ❤️ by the KhathaGPT Team

</div>
