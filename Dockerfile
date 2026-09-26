# Multi-stage optimized Dockerfile for Legalens Backend
# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /build
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Production runtime
FROM python:3.11-slim AS backend

# Security: run as non-root user
RUN groupadd -r legalens && useradd -r -g legalens -d /app -s /sbin/nologin legalens

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY Backend ./Backend
COPY AI ./AI
COPY tests ./tests
COPY pytest.ini .
COPY pyproject.toml .

# Security: set ownership and reduce privileges
RUN chown -R legalens:legalens /app
USER legalens

ENV PORT=8000
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/')" || exit 1

CMD ["uvicorn", "Backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
