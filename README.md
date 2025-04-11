<div align="center">

# 📄 KhataGPT

<img src="https://github.com/user-attachments/assets/6aa214b8-a363-4ea2-8410-562ecab2a251" width="200" height="200" />

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

**🤖 AI-Powered Document Analysis & Chat Platform**

[Getting Started](#getting-started) • [Features](#features) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

## 🌟 Overview

KhataGPT is an intelligent document analysis platform that leverages Google's Gemini AI to transform how users interact with their documents. Extract, analyze, and chat with your documents using state-of-the-art AI technology.

## ✨ Key Features

### 📑 Document Intelligence
- 🔍 Multi-format document support (PDF, DOC, Images)
- 🤖 AI-powered text extraction & analysis
- 📋 Smart categorization & tagging
- 🖼️ Advanced image processing
- 📝 Automatic metadata generation

### 💬 Interactive AI Chat
- 🧠 Context-aware document conversations
- 🌐 Web search integration
- 📊 Structured data extraction
- 🎯 Precision question answering
- ✍️ Rich markdown responses

### 📂 Smart Management
- 🔎 Full-text semantic search
- 📱 Mobile-responsive interface
- 🔄 Real-time sync
- 📊 Analytics dashboard
- 🔐 Secure document handling

## 🛠️ Tech Stack

<table>
<tr>
<td>

### Backend
- ⚡ FastAPI
- 🍃 MongoDB
- 🤖 Google Gemini AI
- 🖼️ PIL/Pillow
- 🌐 BeautifulSoup4
- 🚀 Uvicorn

</td>
<td>

### Frontend
- ⚛️ React
- 🎨 Material-UI
- 🛣️ React Router
- 📡 Axios
- 📝 React Markdown
- 🎯 Redux Toolkit

</td>
</tr>
</table>

## 🏗️ Architecture

    
![diagram-export-3-26-2025-5_05_21-PM](https://github.com/user-attachments/assets/70224c50-187d-476a-9bca-08b8bf813190)

## 🚀 Getting Started

### Prerequisites

- 🐍 Python 3.8+
- 📦 Node.js 14+
- 🍃 MongoDB 4.4+
- 🔑 Gemini API Key

### Quick Start

1. **Clone & Setup**
```bash
git clone https://github.com/KhataGPT/KhataGPT.git
cd KhataGPT
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

4. **Environment Configuration**
```env
# Backend .env
GEMINI_API_KEY=your_key_here
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=KhataGPTv2

# Frontend .env
REACT_APP_API_URL=http://localhost:8000
```

## 📚 Documentation

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/documents` | POST | Upload document |
| `/api/v1/documents` | GET | List documents |
| `/api/v1/chat` | POST | Send message |
| `/api/v1/chat/{id}` | GET | Chat history |

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 🔒 Security

- 🛡️ Input sanitization
- 🔐 JWT authentication
- 📝 Input validation
- 🚫 Rate limiting
- 🔍 Security headers

## 📄 License

MIT License • [View License](LICENSE)

## 💬 Support

- 📧 Email: codehimanshu24@gmail.com
- 💻 [GitHub Issues](https://github.com/KhataGPT/KhataGPT/issues)

---

<div align="center">

Made with ❤️ by the KhataGPT Team

[![Stars](https://img.shields.io/github/stars/KhataGPT/KhataGPT?style=social)](https://github.com/KhataGPT/KhataGPT)
[![Follow](https://img.shields.io/twitter/follow/KhataGPT?style=social)](https://twitter.com/KhataGPT)

</div>

