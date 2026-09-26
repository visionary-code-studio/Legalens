import re
from typing import Tuple, Dict

class PIISanitizer:
    """
    Production Data Privacy & PII Sanitizer for Legalens.
    Redacts sensitive personally identifiable information (PII) and financial tokens
    before prompt submission to Google Gemini models, complying with PromptWar
    Data Privacy & Indian Digital Personal Data Protection Act (DPDPA), 2023.
    """

    PATTERNS = {
        "PAN": (r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b", "[REDACTED_PAN_ID]"),
        "AADHAAR": (r"\b\d{4}\s?\d{4}\s?\d{4}\b", "[REDACTED_AADHAAR_ID]"),
        "PHONE": (r"\b(?:\+91[\-\s]?)?[6-9]\d{9}\b", "[REDACTED_PHONE_NUMBER]"),
        "EMAIL": (r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b", "[REDACTED_EMAIL_ADDRESS]"),
        "SALARY_INR": (r"(?:INR|Rs\.?|₹)\s?[\d,]+(?:\.\d{2})?(?:\s?(?:LPA|p\.a\.|per\sannum|pm|per\smonth))?", "[REDACTED_COMPENSATION_FIGURE]"),
        "IFSC": (r"\b[A-Z]{4}0[A-Z0-9]{6}\b", "[REDACTED_IFSC_CODE]"),
        "ACCOUNT_NO": (r"\b(?:\d{9,18})\b(?=\s*(?:account|a/c|bank))", "[REDACTED_BANK_ACCOUNT]")
    }

    @classmethod
    def sanitize(cls, text: str) -> Tuple[str, Dict[str, int]]:
        """
        Redact sensitive entities and return the sanitized string along with counts of redacted items.
        """
        if not text:
            return "", {}

        sanitized = text
        redactions = {}

        for pii_type, (pattern, placeholder) in cls.PATTERNS.items():
            matches = list(re.finditer(pattern, sanitized, flags=re.IGNORECASE))
            if matches:
                redactions[pii_type] = len(matches)
                sanitized = re.sub(pattern, placeholder, sanitized, flags=re.IGNORECASE)

        return sanitized, redactions

    @classmethod
    def has_pii(cls, text: str) -> bool:
        """Quick boolean check if text contains unmasked PII."""
        if not text:
            return False
        for _, (pattern, _) in cls.PATTERNS.items():
            if re.search(pattern, text, flags=re.IGNORECASE):
                return True
        return False
