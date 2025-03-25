<div align="center">

# KhathaGPT Frontend

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-6.4.8-0081CB?logo=mui)](https://mui.com/)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🚀 Modern React-based frontend for enterprise document analysis powered by Gemini AI

[Getting Started](#getting-started) • 
[Contributing](#contributing) •
[Support](#support)

</div>

---

## 🌟 Features

<table>
<tr>
<td>

### 📄 Document Intelligence
- Smart document classification & analysis
- Multi-format support (PDF, Word, Excel)
- Full-text semantic search
- Real-time processing status
- Version history tracking
- Batch upload capabilities

</td>
<td>

### 💬 AI Interactions
- Context-aware document chat
- Real-time AI responses
- Semantic search
- Citation support
- Custom prompts
- Chat history management

</td>
</tr>
<tr>
<td>

### 🎨 Modern UI/UX
- Responsive Material Design
- Dark/Light themes
- Drag & drop interface
- Progressive loading
- Motion feedback
- Mobile-first approach

</td>
<td>

### 🔧 Technical Features
- Type-safe components
- Modular architecture
- Performance optimized
- PWA ready
- SSR support
- Comprehensive testing

</td>
</tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x+
- npm/yarn
- Git

### Quick Setup

```bash
# Clone repository
git clone https://github.com/yourusername/KhataGPT.git

# Navigate to frontend
cd KhataGPT/frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Setup

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

## 📚 Documentation

### Project Structure
```
frontend/
├── public/                # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/      # Shared components
│   │   ├── documents/   # Document-related components
│   │   └── chat/       # Chat interface components
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route components
│   ├── services/        # API services
│   ├── store/           # State management
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript definitions
│   └── utils/           # Helper functions
└── tests/               # Test suites
```

### Core Technologies

| Category | Technologies |
|----------|-------------|
| Core | React 19, TypeScript |
| UI | Material-UI 6, Framer Motion |
| State | Context API, React Query |
| Testing | Jest, React Testing Library |
| Build | Webpack 5, Babel 7 |
| CI/CD | GitHub Actions |

### Key Commands

```bash
# Development
npm start          # Start dev server
npm test          # Run tests
npm run lint      # Lint code
npm run format    # Format code

# Production
npm run build     # Build for production
npm run analyze   # Bundle analysis
```

## 🛠️ Development

### Code Style

We follow strict coding standards:
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component composition patterns
- Custom hook patterns

### Component Development

```jsx
// Example component structure
const MyComponent = ({ prop1, prop2 }: Props): JSX.Element => {
  // Component logic
  return (
    <StyledWrapper>
      {/* Component JSX */}
    </StyledWrapper>
  );
};
```

### Testing Strategy

- Unit tests for utilities
- Integration tests for components
- E2E tests for critical flows
- Performance testing
- Accessibility testing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Maintenance

## 📦 Deployment

### Build Process

```bash
# Production build
npm run build

# Analyze bundle
npm run analyze
```

## 🔒 Security

- Input sanitization
- XSS prevention
- CSRF protection
- Content security policy
- Regular dependency updates
- Security headers

## 🎯 Performance

- Code splitting
- Lazy loading
- Image optimization
- Bundle optimization
- Caching strategies
- Performance monitoring

## 💪 Support

- [Issue Tracker](https://github.com/yourusername/KhataGPT/issues)

## 📜 License

MIT License - see [LICENSE.md](LICENSE.md)

---

<div align="center">

Made with ❤️ by the KhathaGPT Team
[GitHub](https://github.com/yourusername/KhataGPT) • 

</div>

