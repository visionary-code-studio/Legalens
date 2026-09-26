# Contributing to Legalens

Thank you for your interest in contributing to Legalens! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Legalens.git
   cd Legalens
   ```
3. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Backend (Python / FastAPI)
```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn Backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (Next.js / TypeScript)
```bash
cd Frontend
npm install
npm run dev
```

## Code Quality Standards

- **Python**: Follow PEP 8 conventions. Use type hints. Max line length: 100 characters.
- **TypeScript/React**: Use functional components with hooks. Strict TypeScript mode.
- **Tests**: All new features must include unit tests. Run `pytest -v` before submitting.
- **Security**: Never commit API keys, passwords, or PII. Use `.env` files.

## Running Tests

```bash
# Backend tests
pytest -v --tb=short

# Frontend lint & typecheck
cd Frontend && npm test
```

## Pull Request Process

1. Ensure all tests pass locally
2. Update documentation if needed
3. Write a clear PR description
4. Reference any related issues

## Code of Conduct

Be respectful, inclusive, and constructive. Harassment of any kind will not be tolerated.

---

MIT License © 2026 Visionary Code Studio
