<div align="center">

# ⚖️ LEGALENS (लीगलेंस)
### *Democratizing Legal Intelligence Through Multilingual Generative AI*

[![CI Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen?style=for-the-badge&logo=githubactions)](.github/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen?style=for-the-badge&logo=pytest)](tests/)
[![Security DPDPA 2023](https://img.shields.io/badge/Security-DPDPA%202023%20Audited-blue?style=for-the-badge&logo=shield)](SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Powered%20By-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://python.org)

<p align="center">
  <b>Legalens</b> is a production-ready, privacy-first legal intelligence platform designed to empower everyday citizens, gig-workers, freelancers, and legal researchers across India. By bridging the gap between impenetrable legal jargon and everyday language, Legalens transforms contracts and agreements into clear, actionable intelligence.
</p>

[Explore Demo](#-interactive-walkthrough--demo) • [Core Features](#-the-legalens-suite-the-lenses) • [Architecture](#-system-architecture) • [Getting Started](#-local-installation--quickstart) • [Deployment](#-deployment-guide)

---

</div>

## 📌 Problem Statement

- **90%+ citizens** sign employment contracts, rent agreements, and loan waivers without understanding restrictive covenants or liabilities.
- **Linguistic Exclusion**: Over 85% of Indians prefer regional vernacular languages, while legal agreements remain exclusively in dense, archaic English.
- **Unenforceable Restraints**: Thousands of employees sign void non-compete clauses under Section 27 of the *Indian Contract Act, 1872*, due to lack of statutory literacy.
- **Document Tampering**: Rise in fraudulent gazettes, modified tenancy clauses, and predatory digital signature schemes.

**Legalens** solves this with an enterprise-grade suite of AI tools powered by Google Gemini, grounded in Indian statutory frameworks.

---

## 🔍 The Legalens Suite (The "Lenses")

| Lens | Name | Core Functionality |
| :--- | :--- | :--- |
| 🛡️ | **AuditLens / RiskLens** | Evaluates overall document safety score (0–100), detects predatory clauses, penalty traps, and unconscionable covenants. |
| 📖 | **LexiLens** | Translates complex legal legalese into 8th-grade plain English with evidence citations. |
| 📑 | **ClauseLens** | Automatically extracts and categorizes clauses (Non-Compete, Termination, IP Ownership, Arbitration, Indemnity). |
| 🔀 | **CompareLens** | Dual-contract upload and semantic redline comparison. Identifies added, modified, and removed clauses with impact analysis. |
| 🗣️ | **VaaniLens** | Regional vernacular translation with natural voice narration across major Indian languages (Hindi, Tamil, Telugu, Bengali, Marathi, etc.). |
| 🔍 | **DigitalLens** | Technical and forensic document verification. Checks PDF metadata, e-Sign certificates, font integrity, and pixel tampering. |
| 💬 | **QueryLens** | Real-time SSE streaming legal Q&A assistant grounded in the document context and Indian statutory law (Indian Contract Act 1872, DPDPA 2023). |
| 📋 | **ActionLens** | Generates tailored pre-signing negotiation checklists, milestone calendars, and strategic questions to ask your lawyer. |

---

## 🎥 Interactive Walkthrough & Demo

Legalens includes a dedicated **Watch Demo** page (`/demo`) with an integrated custom player, chapter markers, and instant playback:

- **Quick Tour**: Experience automated risk auditing, bilingual voice synthesis, and multi-file redlining in real-time.
- **Live Video**: Embedded HD demonstration available directly within the interface or locally under `Frontend/public/LegalLens.mp4`.

---

## 🛠️ System Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 16)                           │
│   React 19 • TypeScript • Tailwind CSS • Lucide Icons • Web Audio API  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST & Server-Sent Events (SSE)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                               │
│   Python 3.11+ • SQLAlchemy • Pydantic v2 • Uvicorn • SQLite / Postgre │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│             AI ENGINE                │  │    PARSING & OCR ENGINE      │
│ • Google Gemini (3.5-flash-lite)     │  │ • PyPDF (Metadata & Streams) │
│ • PII Sanitizer & Masker             │  │ • Python-Docx (Word Docs)    │
│ • Adversarial Jailbreak Defense      │  │ • Deep Translator API        │
│ • Indian Statutory Legal RAG         │  │ • Pytesseract OCR (Scans)    │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 🚀 Local Installation & Quickstart

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **Python**: v3.11+
- **Git**
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

---

### Step 1: Clone Repository

```bash
git clone https://github.com/visionary-code-studio/Legalens.git
cd Legalens
```

---

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Backend Settings
PORT=8000
DATABASE_URL=sqlite:///./legalens.db

# Frontend Settings (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### Step 3: Setup & Run Backend (FastAPI)

```bash
# Navigate to project root
python -m venv venv

# Activate Virtual Environment:
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Start Backend Server
uvicorn Backend.main:app --host 127.0.0.1 --port 8000 --reload
```

The FastAPI backend will start at: `http://127.0.0.1:8000`  
Interactive Swagger API docs available at: `http://127.0.0.1:8000/docs`

---

### Step 4: Setup & Run Frontend (Next.js)

Open a new terminal window:

```bash
cd Frontend

# Install Dependencies
npm install

# Start Next.js Development Server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🌐 Deployment Guide

### Option A: Deploy Frontend to Vercel

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Select the `Legalens` repository.
4. Set **Root Directory** to `Frontend`.
5. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g. `https://legalens-api.onrender.com`).
6. Click **Deploy**.

---

### Option B: Deploy Backend to Render

1. Go to [Render Dashboard](https://render.com/) and select **New + -> Web Service**.
2. Connect your GitHub repository `visionary-code-studio/Legalens`.
3. Configure the settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn Backend.main:app --host 0.0.0.0 --port $PORT`
4. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `PYTHON_VERSION`: `3.11.9`
5. Click **Create Web Service**.

---

## 🛡️ Security & Privacy Guardrails

- **Zero Data Retention Default**: Document text can be processed in-memory with automatic sanitization.
- **PII Scrubbing**: Built-in regex and heuristic anonymizers for Aadhaar numbers, PAN cards, phone numbers, and addresses.
- **Jailbreak Guard**: Protects the legal AI against prompt injection and malicious override attempts.
- **Statutory Alignment**: System instructions enforce compliance with the *Indian Contract Act, 1872*, *Information Technology Act, 2000*, and *Digital Personal Data Protection Act (DPDPA), 2023*.

---

## ⚖️ Legal Disclaimer

> **IMPORTANT**: Legalens is an artificial intelligence-powered document assistant and educational tool designed to promote legal literacy. **Legalens does not provide formal legal advice, nor does it create an advocate-client relationship.** Always consult an enrolled advocate or qualified legal practitioner for binding legal decisions or judicial proceedings.

---

## 👥 Contributors & Open Source

Crafted with ❤️ by **Visionary Code Studio**.  
Contributions, bug reports, and pull requests are warmly welcomed! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

```text
MIT License © 2026 Visionary Code Studio
```
