# Legalens — Product Requirements Document (PRD)

**Product:** Legalens  
**Tagline:** *Make Yourself Legally Educated.*  
**Product Category:** GenAI-powered Legal Literacy & Document Intelligence  
**Primary Market (MVP):** India  
**Document Status:** Product Definition v1.0  
**Audience:** Product, Design, Frontend, Backend, GenAI, QA, and Hackathon Presentation Teams

---

## 1. Product Overview

### 1.1 What is Legalens?

**Legalens** is a GenAI-powered legal literacy and document intelligence platform that helps people understand, analyze, compare, verify, and navigate legal information in simple language and in their preferred regional language.

Legalens is designed around one principle:

> **Complex Law → Legalens → Clear Understanding → Informed Next Step**

The platform provides information and assistance rather than replacing professional legal advice.

### 1.2 Core Problem

Legal information is often:

- difficult to understand because of legal terminology;
- distributed across long documents and multiple sources;
- difficult to compare across document versions;
- difficult to interpret for users who are not legally trained;
- harder to access when the user is more comfortable in a regional language;
- difficult to verify when a document claims to originate from an authority;
- disconnected from practical next steps.

### 1.3 Product Opportunity

The challenge is not only to summarize legal documents. Legalens should act as a **legal literacy layer** between ordinary users and complex legal systems.

The product therefore combines:

1. Legal document understanding
2. Clause intelligence
3. Document comparison
4. Vernacular legal accessibility
5. Document authenticity and source verification
6. Grounded legal Q&A
7. Actionable next-step preparation

---

# 2. Product Vision

> **Make reliable legal information easier to understand, easier to access, and easier to act on — without pretending to replace a lawyer.**

## Mission

Enable non-lawyers to understand what legal documents say, identify what deserves attention, ask better questions, and approach professionals with better-prepared information.

---

# 3. Target Users

## Primary Personas

### Persona A — Everyday Citizen

Needs to understand:

- rental agreements;
- notices;
- service agreements;
- government documents;
- consumer-related documents.

**Pain:** “I received this document, but I do not understand what it means.”

### Persona B — Student / Young Professional

Needs to understand:

- employment agreements;
- internship contracts;
- NDAs;
- offer letters;
- policy documents.

**Pain:** “I want to know what I am agreeing to before I sign.”

### Persona C — Small Business / Freelancer

Needs to review:

- vendor agreements;
- client contracts;
- NDAs;
- invoices/terms;
- service agreements.

**Pain:** “I need a fast first-pass review before discussing this with a professional.”

### Persona D — Regional-Language User

Needs legal information in:

- Hindi;
- Bengali;
- Marathi;
- Tamil;
- Telugu;
- Gujarati;
- Kannada;
- other supported languages over time.

**Pain:** “The legal information is available, but not in a language I understand comfortably.”

---

# 4. Product Principles

1. **Grounded over generic** — important answers should be tied to the uploaded document or authoritative sources.
2. **Explain, don't impersonate a lawyer** — Legalens provides informational assistance.
3. **Show evidence** — source, section, page, clause, or paragraph should be surfaced wherever feasible.
4. **Uncertainty is a valid result** — the system must be able to say “Unable to verify.”
5. **Original legal text remains authoritative** — generated explanations are not a replacement.
6. **Privacy by design** — legal documents may contain sensitive personal or business information.
7. **Accessible by language** — legal literacy should not require advanced legal English.
8. **Actionable, not prescriptive** — help users prepare, compare, and ask better questions.

---

# 5. Feature Architecture

## 5.1 LexiLens — Legal Understanding

**Tagline:** *Turn Legal Jargon into Clarity.*

### User goal
Understand complex legal language in plain language.

### Inputs
- PDF
- DOCX/text
- pasted clause
- selected document section

### Outputs
- plain-language explanation;
- important legal terms;
- key parties;
- obligations;
- conditions;
- deadlines;
- cited source/page/section.

### Acceptance criteria
- User can upload a supported document.
- System preserves the original text.
- Explanation clearly distinguishes generated content from source text.
- Important factual claims include supporting evidence when available.

---

## 5.2 ClauseLens — Clause Intelligence

**Tagline:** *See What Matters.*

### Purpose

Detect and organize:

- rights;
- obligations;
- deadlines;
- payment terms;
- termination terms;
- liability;
- indemnity;
- confidentiality;
- intellectual property;
- jurisdiction;
- dispute resolution;
- penalties;
- ambiguity;
- missing information;
- unusual provisions.

### Output model

```text
Clause
→ Clause Type
→ What it means
→ Who is affected
→ Obligation / Right
→ Potential concern
→ Evidence
```

### Important product rule

Do not display a universal “legal risk score” as an objective truth. Legal implications can depend on jurisdiction, facts, negotiation context, and professional interpretation.

Use labels such as:

- Potential Concern
- Ambiguity
- Missing Information
- Unusual Provision
- Conflict Detected
- Requires Review

---

## 5.3 CompareLens — Document Comparison

**Tagline:** *See What Changed.*

### Inputs
Two or more versions of a document.

### Outputs
- added clauses;
- removed clauses;
- modified clauses;
- changed amounts;
- changed dates;
- changed obligations;
- changed parties;
- changed jurisdiction/dispute clauses.

### UX

Use a side-by-side view plus a human-readable change summary.

---

## 5.4 VaaniLens — Vernacular Legal Literacy

**Tagline:** *Law in Your Language.*

### Purpose

Explain legal content in the user's preferred language.

### MVP languages

- English
- Hindi
- Bengali

### Expansion

- Marathi
- Tamil
- Telugu
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Odia

### Output rule

Display:

1. Original legal text
2. AI explanation/translation
3. Important terms
4. Source/evidence

The generated regional-language explanation must not be presented as the authoritative legal text.

---

## 5.5 DigitalLens — Document Verification Intelligence

**Tagline:** *Verify Before You Trust.*

### Purpose

Assist with document authenticity and source-verification checks.

### Checks

#### Integrity signals
- missing pages;
- repeated pages;
- suspicious formatting;
- inconsistent typography;
- structural anomalies;
- inconsistent dates;
- obvious editing indicators.

#### Metadata
- creation time;
- modification time;
- author/producer where available;
- software metadata where available.

#### Signature indicators
- signature presence;
- e-sign indicators;
- certificate metadata where available.

#### Source verification
- claimed document number;
- issuing authority;
- publication/notification details;
- cross-check against trusted sources.

### Status model

```text
VERIFIED_AGAINST_SOURCE
UNVERIFIED
POTENTIAL_TAMPERING_INDICATORS
SOURCE_NOT_FOUND
INSUFFICIENT_EVIDENCE
REQUIRES_OFFICIAL_VERIFICATION
```

### Critical limitation

DigitalLens **must not claim that an arbitrary document is “real” or “fake” solely from AI inspection**.

It should report evidence and confidence state, then recommend verification through the issuing authority when required.

---

## 5.6 QueryLens — Document-Grounded Q&A

**Tagline:** *Ask. Understand. Learn.*

### Examples

- “What are my obligations?”
- “When does this agreement expire?”
- “What is the notice period?”
- “Which clause talks about liability?”
- “What questions should I ask a lawyer?”

### Requirement

The assistant should prefer:

1. uploaded document evidence;
2. retrieved authoritative legal sources;
3. explicit uncertainty when evidence is unavailable.

---

## 5.7 ActionLens — Next-Step Preparation

**Tagline:** *Know What to Do Next.*

### Outputs

- document checklist;
- important dates;
- questions for a lawyer;
- missing information;
- follow-up tasks;
- suggested information to collect;
- source list.

### Constraint

ActionLens prepares users for a next conversation or decision; it should not present a definitive legal strategy as professional legal advice.

---

# 6. Core User Journey

```text
Landing Page
    ↓
Choose a Legalens Tool
    ↓
Upload / Paste / Select Source
    ↓
Document Processing
    ↓
AI + Retrieval
    ↓
Evidence-Grounded Analysis
    ↓
Visual Result
    ├── Explain
    ├── Analyze
    ├── Compare
    ├── Verify
    ├── Ask
    ├── Translate
    └── Prepare Next Steps
```

---

# 7. Functional Requirements

## FR-01 — Authentication

Users should be able to:

- create an account;
- sign in;
- sign out;
- recover access;
- delete their account.

## FR-02 — Document Upload

Supported initial formats:

- PDF;
- DOCX;
- TXT;
- common image formats for scanned documents.

Initial configurable limits should be enforced server-side.

## FR-03 — Document Processing

System must:

- identify document type;
- extract text/content;
- preserve page boundaries where possible;
- detect scanned pages;
- create searchable chunks;
- generate metadata.

## FR-04 — Legal Analysis

System must:

- extract legal entities;
- classify important clauses;
- identify obligations;
- identify dates/amounts;
- retrieve relevant legal sources where supported.

## FR-05 — Citations

Every evidence-backed answer should expose:

- document;
- page;
- section/paragraph/clause;
- source URL or source identifier where appropriate.

## FR-06 — Multilingual Explanation

User can select language before or after analysis.

## FR-07 — Compare

System can compare two document versions and produce a structured difference report.

## FR-08 — Verification

DigitalLens produces evidence-based verification states.

## FR-09 — Chat

User can ask questions while retaining document context.

## FR-10 — Export

Potential outputs:

- PDF report;
- summary;
- checklist;
- question list.

---

# 8. Non-Functional Requirements

## Security

- Encrypt data in transit.
- Use private storage buckets for user documents.
- Enforce row-level authorization.
- Never expose secret API keys to the browser.
- Implement document deletion.
- Keep audit logs for important AI actions.

## Performance Targets

MVP targets:

- initial upload acknowledgement: < 2 seconds;
- common document processing target: < 30 seconds;
- simple Q&A target: < 8 seconds;
- compare operation target: < 30 seconds for ordinary contracts.

These are engineering targets, not guarantees.

## Reliability

- Graceful API fallback.
- Retry transient AI failures.
- Record pipeline stage failures.
- Return transparent error states.

---

# 9. AI Safety & Legal Guardrails

Every high-stakes response should follow the pattern:

```text
Answer
↓
Evidence
↓
Explanation
↓
Uncertainty / Limitations
↓
Professional Review Trigger
```

### Prohibited product behavior

- “You will definitely win.”
- “This contract is definitely illegal.”
- “This document is definitely fake.”
- “You do not need a lawyer.”
- fabricated citations;
- invented legal sections;
- unsupported legal conclusions.

### Preferred phrasing

- “Based on the provided document...”
- “The retrieved source states...”
- “This may require professional review.”
- “Legalens could not verify this claim from an authoritative source.”
- “The document contains an indicator that warrants verification.”

---

# 10. Success Metrics

## Product metrics

- successful document processing rate;
- analysis completion rate;
- average time to useful answer;
- comparison completion rate;
- multilingual usage;
- source/citation open rate;
- user-reported usefulness.

## AI quality metrics

- retrieval precision;
- citation correctness;
- grounded answer rate;
- unsupported claim rate;
- clause classification F1;
- verification precision/recall on a controlled benchmark;
- multilingual explanation quality.

## Trust metrics

- percentage of responses with evidence;
- user correction rate;
- “unable to verify” correctness;
- false-positive verification rate.

---

# 11. MVP Scope

### Must Have

- authentication;
- document upload;
- LexiLens;
- ClauseLens;
- QueryLens;
- VaaniLens;
- basic CompareLens;
- evidence/citations;
- private document storage;
- basic admin/evaluation tools.

### Should Have

- DigitalLens source matching;
- ActionLens;
- export;
- document history;
- feedback loop.

### Could Have

- voice interaction;
- additional Indian languages;
- advanced source graph;
- document signing workflow;
- professional handoff workflow.

### Won’t Have in MVP

- legal outcome prediction;
- autonomous legal representation;
- automated filing in courts;
- guaranteed authenticity certification;
- definitive legal advice.

---

# 12. Release Roadmap

## Phase 0 — Research

- legal-source inventory;
- dataset/licensing audit;
- UX research;
- evaluation benchmark design.

## Phase 1 — Foundation

- auth;
- upload;
- storage;
- text/PDF processing;
- metadata;
- RAG pipeline.

## Phase 2 — Core Intelligence

- LexiLens;
- ClauseLens;
- QueryLens;
- citations.

## Phase 3 — Differentiation

- VaaniLens;
- CompareLens;
- ActionLens.

## Phase 4 — Innovation

- DigitalLens;
- authoritative-source cross-verification;
- integrity analysis.

## Phase 5 — Hardening

- security review;
- evaluation;
- prompt testing;
- latency/cost optimization;
- demo reliability.

---

# 13. Definition of Done for MVP

A feature is complete when:

- UI is implemented;
- backend API exists;
- validation exists;
- errors are handled;
- AI output uses structured schemas;
- citations/evidence are displayed;
- security rules are tested;
- evaluation cases exist;
- a real sample document passes end-to-end.

---

# 14. Legalens Product Promise

> **Legalens does not make legal decisions for you. It helps you understand the information you need to make better-informed decisions and have better conversations with legal professionals.**
