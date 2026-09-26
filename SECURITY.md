# Security & Data Privacy Policy

## 1. Statutory Compliance (DPDPA 2023)
Legalens strictly adheres to the **Digital Personal Data Protection Act, 2023 (DPDPA 2023)** of India and international privacy benchmarks:
- **Zero Raw PII Transmission**: Indian identifiers including Permanent Account Number (PAN), UIDAI Aadhaar, 10-digit mobile numbers, personal email addresses, and bank account credentials are sanitized and redacted client-side and server-side before invocation of LLM inference engines.
- **Ephemeral Storage & Privacy**: Uploaded legal agreements are stored with cryptographic SHA-256 access seals (`user_seal`). Documents can be deleted irreversibly by the user at any time via the UI (`X` button) or the `DELETE /api/documents/{id}` REST endpoint.
- **No Model Training on User Data**: User documents and conversational queries submitted to Google Gemini API are processed through zero-data-retention enterprise inference endpoints and are never utilized for model training.

## 2. Adversarial & Jailbreak Defense
Legalens includes a heuristic and semantic safety layer (`AI.security.jailbreak_guard.JailbreakGuard`):
- **Prompt Injection Defense**: Intercepts direct system prompt overrides, developer instruction extraction attempts, and delimiter-based exploits.
- **Unauthorized Practice of Law Guard**: Intercepts requests demanding guaranteed litigation outcomes or unauthorized advocate representation, attaching standard statutory informational disclaimers in accordance with Bar Council of India guidelines.
- **Illicit Request Interception**: Refuses requests seeking assistance in contract forgery, statutory evasion, or fraud.

## 3. Web & API Security Controls
- **HTTP Security Headers**: Enforces strict `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, and `Referrer-Policy`.
- **Path Traversal Protection**: Uploaded file names are sanitized against directory traversal attacks (`../`) using strict regex character whitelisting and UUID prefixing.
- **CORS Configuration**: Restricts API communications to authorized origins and localhost development environments.

## 4. Reporting Security Vulnerabilities
If you discover a potential security vulnerability within Legalens, please report it immediately:
- **Security Cell**: `security@legalens.ai`
- **Response SLA**: Initial triage within 24 hours.
