import re
from typing import Tuple, Optional

class JailbreakGuard:
    """
    Adversarial Attack & Prompt Injection Shield for Legalens.
    Guards against:
    1. System prompt extraction and leakage.
    2. Role-reversal / "ignore previous instructions" jailbreaks.
    3. Illicit legal assistance (forgery, document falsification, tax fraud, perjury).
    4. Hallucinatory bypasses attempting to override grounding rules.
    """

    ADVERSARIAL_PATTERNS = [
        r"(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|rules|directives)",
        r"(?:reveal|show|print|display|tell\s+me)\s+(?:your|the)\s+(?:system\s+)?(?:prompt|instructions|initial\s+prompt)",
        r"you\s+are\s+now\s+(?:an?\s+)?(?:unrestricted|jailbroken|evil|unfiltered|DAN|lawyer\s+who\s+gives\s+advice)",
        r"(?:act|behave|pretend)\s+as\s+(?:if\s+you\s+have\s+no\s+rules|an\s+unfiltered\s+AI)",
        r"(?:how\s+to|help\s+me)\s+(?:forge|fake|falsify|fabricate)\s+(?:a\s+signature|contract|stamp|court\s+order)",
        r"(?:evade|avoid)\s+(?:taxes|income\s+tax)\s+(?:illegally|without\s+detection)",
        r"(?:bribe|corrupt)\s+(?:an?\s+)?(?:official|judge|police|advocate)",
        r"you\s+must\s+say\s+I\s+will\s+definitely\s+win"
    ]

    GUARDRAIL_REFUSAL = (
        "Legalens is an evidence-grounded legal literacy companion operating under strict safety guardrails. "
        "I cannot fulfill requests that attempt to override system security, bypass document grounding, "
        "or provide unauthorized legal representation or assistance with illicit activities. "
        "Please ask questions related to understanding and reviewing your uploaded document."
    )

    @classmethod
    def check_query(cls, query: str) -> Tuple[bool, Optional[str]]:
        """
        Evaluate if a user prompt is safe or an adversarial attempt.
        Returns:
            (is_safe: bool, refusal_message: Optional[str])
        """
        if not query:
            return True, None

        normalized = query.strip().lower()

        for pattern in cls.ADVERSARIAL_PATTERNS:
            if re.search(pattern, normalized, flags=re.IGNORECASE):
                return False, cls.GUARDRAIL_REFUSAL

        return True, None
