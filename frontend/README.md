# KhataGPT Frontend

React-based frontend for the KhataGPT document analysis system. This application provides an intuitive interface for uploading, analyzing and chatting with documents using Google's Gemini AI.

## Technology Stack

- **React 19.0.0**: Modern UI library 
- **Material-UI 6.4.8**: Component framework
- **React Router 7.4.0**: Client-side routing
- **Axios 1.8.4**: HTTP client
- **React Markdown 10.1.0**: Markdown rendering
- **Remark/Rehype**: Markdown plugins
- **Web Vitals**: Performance monitoring

## Project Structure

```
frontend/
├── public/                # Static files
│   ├── index.html        # HTML template
│   └── manifest.json     # PWA manifest
├── src/
│   ├── components/       # Reusable components
│   │   ├── chat/        # Chat related components
│   │   ├── common/      # Shared components
│   │   └── documents/   # Document components
│   ├── pages/           # Route pages
│   ├── services/        # API services
│   └── styles/          # Global styles
└── package.json         # Dependencies
```

## Features

### Document Management
- Upload multiple document types (receipts, menus, forms)
- Automatic document classification
- Smart title generation
- Full-text search
- Grid/List view options
- Real-time document processing status
- Delete with confirmation

### Chat Interface
- Context-aware document chat
- Real-time AI responses
- Markdown formatting
- Code syntax highlighting
- Table formatting
- Web search integration
- Chat history tracking
- Message timestamps

### UI Features
- Responsive design
- Dark/Light theme
- Loading states
- Error handling
- Toast notifications
- Drag & drop uploads
- Mobile-optimized views
- Keyboard shortcuts

## Setup & Installation

1. Clone repository:
```bash
git clone https://github.com/yourusername/KhataGPT-frontend.git
cd KhataGPT-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm start
```

## Available Scripts

- `npm start`: Run development server
- `npm build`: Create production build
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App
- `npm lint`: Run ESLint
- `npm format`: Format code with Prettier

## API Integration

### Document Endpoints
- `POST /documents`: Upload document
- `GET /documents`: List documents
- `GET /documents/{id}`: Get document
- `DELETE /documents/{id}`: Delete document

### Chat Endpoints
- `POST /chat`: Send message
- `GET /chat/{documentId}`: Get chat history
- `DELETE /chat/{documentId}`: Clear chat

## Component Overview

### ChatInterface
```jsx
<ChatInterface
  documentId="string"
  documentTitle="string"
/>
```

### DocumentList
```jsx
<DocumentList
  documents={documents}
  onDeleteDocument={handleDelete}
/>
```

### DocumentUploader
```jsx
<DocumentUploader
  onUploadComplete={handleUpload}
/>
```

## State Management

- React hooks for local state
- Context for theme/auth
- URL params for document/chat state
- Local storage for preferences

## Error Handling

- API error interceptors
- User-friendly error messages
- Retry mechanisms
- Offline detection
- File validation
- Input sanitization

## Performance Optimizations

- Image compression
- Lazy loading
- Code splitting
- Debounced search
- Memoized components
- Virtual scrolling for long lists

## Security Features

- Input validation
- File type checking
- Size limits
- Markdown sanitization
- Error message sanitization
- Secure HTTP headers

## Browser Support

- Chrome/Edge (latest 2)
- Firefox (latest 2)
- Safari (latest 2)
- Mobile browsers

## Development Guidelines

### Code Style
- Functional components
- TypeScript
- ESLint + Prettier
- SOLID principles
- React best practices

### Git Workflow
1. Create feature branch
2. Implement changes
3. Run tests
4. Create pull request
5. Code review
6. Merge to main

## Testing

### Unit Tests
```bash
npm test
```

### Component Tests
```bash
npm test:components
```

### E2E Tests
```bash
npm test:e2e
```

## Deployment

1. Build production assets:
```bash
npm run build
```

2. Deploy to hosting:
```bash
npm run deploy
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create pull request

## Troubleshooting

### Common Issues
- API connection errors
- File upload failures
- Chat disconnections
- Browser compatibility

### Solutions
- Check API URL in .env
- Verify file types/sizes
- Clear browser cache
- Update dependencies

## License

MIT License - see LICENSE.md

## Support

- GitHub Issues
- Documentation Wiki
- Community Discord

## Changelog

### v2.0.0
- Gemini AI integration
- New chat interface
- Performance improvements
- Enhanced document processing

