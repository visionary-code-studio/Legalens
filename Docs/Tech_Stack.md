# Legalens — Technology Stack

**Architecture Style:** Full-stack Web + RAG + Multimodal GenAI + Evidence Layer  
**Primary Deployment Goal:** Fast, secure hackathon MVP with a path to production  
**Target Market:** India

---

# 1. Recommended Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js + React + TypeScript | Web application |
| Styling | Tailwind CSS | Design system |
| UI | shadcn/ui + Radix-style primitives | Accessible components |
| Motion | Framer Motion | Interaction/motion |
| Backend API | FastAPI (Python) | AI/document services |
| App API | Next.js Route Handlers / BFF | Frontend-facing orchestration |
| Database | Supabase Postgres | Users, metadata, jobs, feedback |
| Auth | Supabase Auth | Authentication + authorization |
| File Storage | Supabase Storage | Private user documents |
| Vector Search | Pinecone (recommended) | RAG retrieval at scale |
| Embeddings | Gemini Embeddings | Semantic representations |
| LLM / Multimodal | Gemini API | Document analysis + reasoning |
| Workflow | FastAPI services + task queue | Long-running jobs |
| OCR | Gemini PDF/document processing initially | Scanned/legal PDF extraction |
| External Legal Search | Indian Kanoon API | Case/document retrieval where licensed |
| Primary Legal Corpus | India Code + other authoritative sources | Statutory/legal source ingestion |
| Deployment | Vercel + Google Cloud/Cloud Run | Web + Python services |
| Monitoring | Sentry + structured logging | Error monitoring |
| CI/CD | GitHub Actions | Build/test/deploy |

---

# 2. Architecture

```text
                         ┌─────────────────────────┐
                         │       Next.js Web        │
                         │ React + TypeScript       │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │ API / BFF Layer          │
                         │ Auth + request routing   │
                         └──────┬───────────┬──────┘
                                │           │
                       ┌────────▼───┐   ┌──▼─────────────┐
                       │ FastAPI AI  │   │ Supabase       │
                       │ Services    │   │ Postgres/Auth  │
                       └─────┬──────┘   │ Storage        │
                             │          └────────────────┘
        ┌────────────────────┼─────────────────────────┐
        │                    │                         │
        ▼                    ▼                         ▼
  Gemini Multimodal      Pinecone RAG            Legal Sources
  + Structured Output    + Metadata              India Code /
                                                 Indian Kanoon
        │                    │
        └──────────┬─────────┘
                   ▼
             Evidence Layer
                   │
                   ▼
             Legalens Response
```

---

# 3. Frontend

## Next.js

Use Next.js for:

- routing;
- server rendering where useful;
- authentication-aware layouts;
- API/BFF endpoints;
- file upload UI;
- dashboards;
- streaming chat UI.

## TypeScript

Use strict TypeScript.

Recommended configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

## Tailwind CSS

Use semantic design tokens instead of hardcoded colors.

Core visual identity:

- Black;
- White;
- neutral grays;
- one controlled accent for status/interaction.

---

# 4. Backend

## FastAPI

Python is recommended because the AI/document ecosystem is broad and Python is convenient for:

- document parsing;
- RAG pipelines;
- embeddings;
- evaluation;
- structured extraction;
- data ingestion.

Suggested modules:

```text
backend/
├── api/
├── auth/
├── documents/
├── retrieval/
├── legal_sources/
├── analysis/
├── verification/
├── translation/
├── comparison/
├── prompts/
├── schemas/
├── evaluation/
└── common/
```

---

# 5. GenAI

## Gemini API

Use Gemini for:

- PDF/document understanding;
- multimodal analysis;
- legal text explanation;
- extraction;
- structured outputs;
- multilingual generation;
- Q&A;
- document comparison.

Google's current Gemini documentation states that Gemini can process PDFs with native document understanding, including text, images, tables and diagrams, and supports structured outputs. PDF inputs are documented up to 50 MB or 1000 pages. For Legalens, do not assume every provider/model configuration will handle every file identically; enforce application-level limits and test representative documents.  
Source: https://ai.google.dev/gemini-api/docs/document-processing  
Source: https://ai.google.dev/gemini-api/docs/structured-output

---

# 6. Embeddings / Retrieval

## Preferred MVP Option

### Pinecone

Use Pinecone for:

- semantic retrieval;
- source chunk search;
- clause similarity;
- legal document retrieval.

Metadata should include:

```json
{
  "document_id": "doc_123",
  "source_type": "statute",
  "jurisdiction": "IN",
  "authority": "India Code",
  "act_name": "Example Act",
  "section": "12",
  "page": 4,
  "effective_from": "2026-01-01",
  "language": "en",
  "chunk_id": "chunk_22"
}
```

## Alternative

For a lower-infrastructure MVP, Supabase Postgres + pgvector can consolidate relational storage and vector search. Supabase documents pgvector support for storing/querying embeddings and semantic/hybrid search.  
Source: https://supabase.com/docs/guides/database/extensions/pgvector  
Source: https://supabase.com/docs/guides/ai

### Decision

**Hackathon / fast prototype:** Pinecone + Supabase  
**Cost-sensitive single-database architecture:** Supabase pgvector

---

# 7. Database

## Supabase Postgres

Use tables such as:

```text
profiles
documents
document_pages
document_chunks
analysis_jobs
analyses
analysis_findings
conversation_threads
messages
citations
comparison_jobs
verification_checks
translations
feedback
evaluation_runs
audit_events
```

Supabase provides Postgres, Auth, Storage and access-control capabilities in one platform. RLS should be enforced for user-owned data.  
Source: https://supabase.com/docs/guides/auth  
Source: https://supabase.com/docs/guides/database/overview

---

# 8. Storage

Store uploaded legal documents in a **private Supabase Storage bucket**.

Recommended:

```text
legal-documents/
  {user_id}/
    {document_id}/
      original/
      derived/
```

Do not expose public object URLs for private legal documents.

Use signed, short-lived access URLs when required.

---

# 9. Document Processing Pipeline

```text
Upload
  ↓
Virus / file validation
  ↓
MIME/type validation
  ↓
Store original
  ↓
Extract pages/content
  ↓
OCR / document understanding
  ↓
Normalize text
  ↓
Detect sections / clauses
  ↓
Create chunks
  ↓
Attach metadata
  ↓
Generate embeddings
  ↓
Index
```

Gemini's document-processing APIs can analyze PDFs beyond plain text extraction, including visual elements and tables.  
Source: https://ai.google.dev/gemini-api/docs/document-processing

---

# 10. Chunking Strategy

Do not use only arbitrary fixed-size chunks for legal documents.

Prefer **structure-aware chunking**:

```text
Document
├── Title
├── Preamble
├── Section
│   ├── Subsection
│   ├── Clause
│   └── Explanation
├── Schedule
└── Annexure
```

Each chunk should retain:

```json
{
  "chunk_id": "...",
  "document_id": "...",
  "page_start": 3,
  "page_end": 3,
  "section": "12",
  "heading": "Liability",
  "text": "...",
  "jurisdiction": "IN"
}
```

---

# 11. RAG Architecture

## Retrieval Pipeline

```text
User Question
      ↓
Intent Classification
      ↓
Query Normalization
      ↓
Metadata Filter
      ↓
Semantic Retrieval
      ↓
Keyword / exact retrieval
      ↓
Reranking
      ↓
Evidence Pack
      ↓
LLM Generation
      ↓
Citation Validation
      ↓
Response
```

## Retrieval rules

Prioritize:

1. exact uploaded-document passages;
2. authoritative statutory sources;
3. trusted case-law sources;
4. other indexed sources with lower trust.

---

# 12. External Legal Sources

## India Code

Use authoritative legal materials for legislation and subordinate legislation where available.

Source: https://www.indiacode.nic.in/

## Indian Kanoon API

Potentially use for case/document search and retrieval subject to its API terms and licensing.

The current API documentation exposes search, document, court-copy, document-fragment and document-metadata endpoints, with token-based or cryptographic authentication options.  
Source: https://api.indiankanoon.org/documentation/

Before production use, complete a licensing/terms review and define caching/attribution rules.

---

# 13. API Contract

### POST /api/documents

Upload a document.

### GET /api/documents/:id

Return metadata.

### POST /api/documents/:id/analyze

Start analysis.

### GET /api/analyses/:id

Get analysis status/result.

### POST /api/query

Ask a grounded question.

### POST /api/compare

Compare documents.

### POST /api/translate

Generate a vernacular explanation.

### POST /api/verify

Run DigitalLens verification.

### GET /api/sources/:id

Retrieve source evidence.

---

# 14. Suggested JSON Response

```json
{
  "answer": "The clause requires 30 days' notice.",
  "confidence": "high",
  "evidence": [
    {
      "document_id": "doc_123",
      "page": 7,
      "section": "Termination",
      "quote": "..."
    }
  ],
  "source_status": "grounded",
  "disclaimer": "Informational assistance only."
}
```

---

# 15. Security Architecture

## Authentication

Supabase Auth + JWT.

## Authorization

Use Row Level Security for:

- documents;
- analyses;
- messages;
- saved reports.

## API secrets

Only backend services access:

- Gemini keys;
- Indian Kanoon credentials;
- Pinecone credentials;
- service-role secrets.

Never put these in browser-exposed environment variables.

## Logging

Log:

- request ID;
- user ID hash/reference;
- model;
- latency;
- token usage;
- retrieval count;
- error state.

Do not log raw legal-document content by default.

---

# 16. Deployment

## Frontend

Vercel

## Python AI Services

Google Cloud Run or equivalent container platform.

## Database / Storage

Supabase.

## Vector DB

Pinecone.

## CI/CD

GitHub Actions:

```text
Pull Request
   ↓
Lint
   ↓
Typecheck
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
Build
   ↓
Deploy Preview
```

---

# 17. Environment Variables

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=

PINECONE_API_KEY=
PINECONE_INDEX=

INDIANKANOON_API_TOKEN=

SENTRY_DSN=
```

Secrets must only exist in secure server environments.

---

# 18. Recommended Repository

```text
legalens/
├── apps/
│   └── web/
├── services/
│   └── ai-api/
├── packages/
│   ├── ui/
│   ├── types/
│   └── config/
├── data/
│   ├── samples/
│   └── evaluation/
├── scripts/
├── docs/
├── .github/
└── README.md
```

---

# 19. Engineering Priorities

1. Evidence correctness
2. Security/privacy
3. Reliable document processing
4. Retrieval quality
5. UX clarity
6. Latency
7. Cost optimization
