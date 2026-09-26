# Legalens — UI & UX Specification

**Brand:** Legalens  
**Tagline:** *Make Yourself Legally Educated.*  
**Visual Direction:** Black + White Legal-Tech  
**Design Keywords:** Authority, Clarity, Precision, Trust, Accessibility, Editorial Minimalism

---

# 1. UX Vision

Legalens should feel like a **modern legal information instrument**, not a traditional law-firm website and not a generic AI chatbot.

The interface should communicate:

> **“I can understand what this document says, see the evidence, and know what to look at next.”**

---

# 2. Visual Concept

## Black

Represents:

- authority;
- law;
- seriousness;
- professionalism;
- structure.

## White

Represents:

- clarity;
- transparency;
- accessibility;
- readable information;
- open knowledge.

## Lens Metaphor

The brand name should inform the interface:

> **Legalens gives the user a clearer lens into legal information.**

Use:

- circular/elliptical motifs;
- focus states;
- highlighted passages;
- evidence markers;
- magnification-inspired microinteractions;
- structured “view through the lens” transitions.

Avoid literal courtroom ornamentation everywhere. The product should feel digital and intelligent.

---

# 3. Design System

## Typography

Recommended:

### Headings
- Manrope
- Inter
- Geist Sans

### Body
- Inter
- Source Sans 3

### Legal/source text

Use a highly readable serif or neutral sans only when it improves document fidelity.

## Type scale

```text
Display: 64 / 72
H1: 48 / 56
H2: 36 / 44
H3: 24 / 32
Body: 16 / 24
Small: 14 / 20
Caption: 12 / 16
```

Use fewer font sizes in production to keep the UI coherent.

---

# 4. Color System

### Core

```css
--black: #0A0A0A;
--white: #FFFFFF;
--gray-950: #141414;
--gray-900: #1C1C1C;
--gray-700: #404040;
--gray-500: #737373;
--gray-300: #D4D4D4;
--gray-100: #F5F5F5;
--gray-50: #FAFAFA;
```

### Semantic states

Use restrained status colors only:

- success;
- warning;
- danger;
- information.

Do not make the entire application colorful.

---

# 5. Navigation

Desktop:

```text
LEGALENS
──────────────────────────────────────────
Home
My Documents
Tools
  ├── LexiLens
  ├── ClauseLens
  ├── CompareLens
  ├── VaaniLens
  ├── DigitalLens
  ├── QueryLens
  └── ActionLens
History
Saved
Settings
```

Header:

```text
[Legalens]      Search      Language      Profile
```

---

# 6. Landing Page

## Hero

### Headline

**Make Yourself Legally Educated.**

### Supporting line

> Understand complex legal documents, verify important information, explore clauses, compare agreements, and learn what to ask next — in language you understand.

### Primary CTA

**Analyze a Document**

### Secondary CTA

**Explore Legalens**

### Hero visual

A legal document in the center with a “lens” focus overlay.

The overlay reveals:

```text
IMPORTANT CLAUSE
Termination
90 days notice
```

This visually communicates the product.

---

# 7. Home Dashboard

## User greeting

> What would you like to understand today?

### Primary action card

**Upload a Legal Document**

Drag and drop.

### Tool grid

```text
┌───────────────┬───────────────┬───────────────┐
│ LexiLens      │ ClauseLens    │ CompareLens   │
│ Understand    │ Analyze       │ Compare       │
├───────────────┼───────────────┼───────────────┤
│ VaaniLens     │ DigitalLens   │ QueryLens     │
│ Your Language │ Verify        │ Ask           │
├───────────────┼───────────────┼───────────────┤
│ ActionLens    │ Recent Docs   │ Saved Results │
│ Next Steps    │               │               │
└───────────────┴───────────────┴───────────────┘
```

---

# 8. Document Workspace

This is the most important screen.

## Layout

```text
┌────────────────────────────────────────────────────────────┐
│ Document Name                 Language   Actions             │
├───────────────────────┬────────────────────────────────────┤
│                       │                                    │
│ Document Viewer       │ AI Insight Panel                   │
│                       │                                    │
│ Page 7                │ ClauseLens                         │
│                       │                                    │
│ [highlighted clause]  │ ⚠ Potential Concern                │
│                       │                                    │
│                       │ Explanation                         │
│                       │ ...                                │
│                       │                                    │
│                       │ Source: Page 7                     │
└───────────────────────┴────────────────────────────────────┘
```

### Key interaction

Clicking an AI finding should:

**AI Finding → Scroll Document → Highlight Evidence**

This is a high-value trust interaction.

---

# 9. Evidence UI

Every evidence-backed response should have a compact citation card.

```text
SOURCE
Employment Agreement

PAGE 7 · CLAUSE 8

“...30 days written notice...”

[View in document]
```

This is more trustworthy than a generic source list.

---

# 10. LexiLens UI

```text
Original Clause
────────────────────────────
[legal text]

Legalens Explanation
────────────────────────────
[plain-language explanation]

Important Terms
[Indemnity] [Liability]

Source
[Page 3 · Section 5]
```

Include:

**Show Original / Simplified**

toggle.

---

# 11. ClauseLens UI

Use an attention-oriented list:

```text
CLAUSE FINDINGS

● Termination
  90-day notice
  Page 8

● Payment
  ₹50,000 fee
  Page 4

● Liability
  Broad wording
  Page 9

● Arbitration
  Mandatory dispute process
  Page 11
```

Selecting a card focuses the relevant document text.

---

# 12. CompareLens UI

Use a 3-column model:

```text
VERSION A      CHANGE      VERSION B
─────────────────────────────────────────
30 days        →           90 days
Notice                        

₹5 lakh        →           Unlimited
Liability
```

Filters:

- All Changes
- Added
- Removed
- Modified
- Important

---

# 13. VaaniLens UI

## Language selector

```text
Explain in:
[ English ▼ ]
```

Example:

```text
ORIGINAL
The lessee shall...

BENGALI EXPLANATION
ভাড়াটিয়াকে...

IMPORTANT
This is an AI-generated explanation.
The original legal text remains authoritative.
```

Keep the original and generated explanation visually separate.

---

# 14. DigitalLens UI

DigitalLens should visually avoid a fake certainty meter.

### Recommended result

```text
DIGITALLENS
Document Verification

Status
⚠ UNVERIFIED

What we checked
✓ Document structure
✓ Metadata
✓ Claimed document number
⚠ Issuing-source match not found

What this means
Legalens could not establish authenticity
from the available evidence.

Recommended action
Verify the document with the issuing authority.
```

This is much safer than:

```text
REAL: 92%
```

---

# 15. QueryLens UI

Use conversational layout:

```text
┌───────────────────────────────────────────┐
│ Ask about this document                   │
├───────────────────────────────────────────┤
│ You: What is the termination period?      │
│                                           │
│ Legalens:                                 │
│ The agreement requires 90 days' notice.   │
│                                           │
│ Evidence                                  │
│ Page 8 · Clause 11                        │
├───────────────────────────────────────────┤
│ Ask a question...                 [Send]  │
└───────────────────────────────────────────┘
```

Add quick questions:

- “What am I required to do?”
- “What can cost me money?”
- “What should I ask a lawyer?”

---

# 16. ActionLens UI

Show an action board.

```text
WHAT TO REVIEW

☐ Confirm notice period
☐ Check liability clause
☐ Collect payment records
☐ Verify jurisdiction

QUESTIONS FOR A LEGAL PROFESSIONAL

1. ...
2. ...
3. ...
```

This turns AI output into a useful preparation artifact.

---

# 17. Accessibility

Must support:

- keyboard navigation;
- visible focus states;
- semantic headings;
- readable contrast;
- screen-reader labels;
- text resizing;
- language switching;
- reduced-motion preference.

Do not rely on color alone for:

- risk states;
- document differences;
- verification status.

---

# 18. Motion System

Motion should communicate:

- document processing;
- evidence focus;
- state transitions;
- navigation.

Example:

**Analyze → Lens closes → document opens → findings materialize**

Avoid excessive animation in legal information screens.

---

# 19. Responsive Behavior

## Desktop

Three-panel workspace.

## Tablet

Document + AI panel with collapsible sidebar.

## Mobile

Stacked:

```text
Document
↓
Finding
↓
Evidence
↓
Explanation
↓
Action
```

Use sticky bottom controls for:

- Ask;
- Translate;
- Compare;
- Save.

---

# 20. Trust UX

Every AI-generated result should communicate:

### Source

Where did this come from?

### Scope

What did Legalens analyze?

### Confidence / evidence status

How well is the answer supported?

### Limitation

What could not be verified?

### Next step

What should the user consider doing?

Trust should be designed into the UI, not added only in a footer disclaimer.

---

# 21. Design Components

Build reusable components:

```text
DocumentUploader
DocumentViewer
EvidenceCard
ClauseFindingCard
SourceBadge
RiskNotice
VerificationStatus
LanguageSelector
ComparisonDiff
AIMessage
LegalensDisclaimer
ActionChecklist
QuestionPrompt
DocumentSidebar
AnalysisProgress
EmptyState
ErrorState
```

---

# 22. Key UX Principle

> **Every important AI statement should have a path back to evidence.**

The user should be able to move:

**Insight → Evidence → Original Document**

in one or two interactions.

---

# 23. Brand Tone

Legalens should sound:

- clear;
- professional;
- calm;
- educational;
- neutral;
- non-judgmental.

Avoid:

- fear-based language;
- “guaranteed”;
- “100% legal”;
- “definitely illegal”;
- “AI lawyer”;
- exaggerated confidence.
