# Multi-stage optimized Dockerfile for Legalens
FROM python:3.11-slim as backend

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Backend ./Backend
COPY AI ./AI
COPY tests ./tests
COPY pytest.ini .

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "Backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
