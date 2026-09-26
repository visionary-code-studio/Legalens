from typing import List, Optional, Literal
from pydantic import BaseModel, Field

# --- LexiLens Schemas ---
class LexiLensResult(BaseModel):
    plain_explanation: str = Field(description="Clear explanation of the legal text in plain English")
    key_points: List[str] = Field(description="Bulleted core takeaways from the clause")
    important_terms: List[str] = Field(description="Key legal terminology defined in simple words")
    parties_affected: List[str] = Field(description="Parties mentioned or affected by this clause")
    evidence_reference: str = Field(description="Specific clause number and page reference")
    disclaimer: str = Field(
        default="This is an AI-generated explanation, not legal advice.",
        description="Mandatory legal disclaimer"
    )

# --- ClauseLens Schemas ---
class ClauseFinding(BaseModel):
    clause_id: int
    clause_title: str
    clause_type: Literal[
        "confidentiality", "termination", "payment", "intellectual_property",
        "non_compete", "governing_law", "dispute_resolution", "liability",
        "indemnity", "miscellaneous", "other"
    ]
    risk_level: Literal["High Risk", "Medium Risk", "Low Risk"]
    meaning: str
    who_it_affects: str
    key_obligations: List[str]
    potential_concerns: List[str]
    relevant_section: str
    page_number: int

class ClauseLensReport(BaseModel):
    document_name: str
    total_clauses_detected: int
    clauses: List[ClauseFinding]

# --- CompareLens Schemas ---
class ComparisonItem(BaseModel):
    id: int
    clause_or_section: str
    document_a_value: str
    document_b_value: str
    change_type: Literal["Modified", "Added", "Removed", "Unchanged"]
    significance: Literal["High", "Medium", "Low"]
    impact_summary: str

class CompareLensResult(BaseModel):
    doc_a_name: str
    doc_b_name: str
    total_changes: int
    modified_count: int
    added_count: int
    removed_count: int
    changes: List[ComparisonItem]

# --- VaaniLens Schemas ---
class VaaniLensResult(BaseModel):
    source_language: str = "en"
    target_language: str
    original_text: str
    vernacular_explanation: str
    preserved_terms: List[dict] = Field(
        description="Legal terms and their contextual translations",
        default_factory=list
    )
    disclaimer: str = Field(
        default="This is an AI-generated explanation. Please refer to the original text for accuracy."
    )

# --- DigitalLens Schemas ---
class VerificationSignal(BaseModel):
    name: str
    status: Literal["passed", "warning", "failed"]
    summary: str
    detail: Optional[str] = None

class DigitalLensResult(BaseModel):
    document_name: str
    overall_status: Literal[
        "VERIFIED_AGAINST_SOURCE",
        "LIKELY_AUTHENTIC",
        "UNVERIFIED",
        "POTENTIAL_TAMPERING_INDICATORS",
        "SOURCE_NOT_FOUND",
        "REQUIRES_OFFICIAL_VERIFICATION"
    ]
    status_label: str
    summary_verdict: str
    signals: List[VerificationSignal]
    recommended_action: str
    disclaimer: str = Field(
        default="Verification is AI-assisted. Please verify with the issuing authority for final confirmation."
    )

# --- QueryLens Schemas ---
class EvidenceCitation(BaseModel):
    document_id: Optional[str] = None
    page: int
    clause: str
    exact_quote: str

class QueryLensResponse(BaseModel):
    question: str
    answer: str
    bullet_points: List[str] = Field(default_factory=list)
    citations: List[EvidenceCitation]
    confidence_state: Literal["GROUNDED", "PARTIALLY_GROUNDED", "INSUFFICIENT_EVIDENCE", "UNVERIFIED"]
    source_reference: str
    disclaimer: str = Field(
        default="Informational assistance only. Based on the uploaded document."
    )

# --- ActionLens Schemas ---
class ChecklistItem(BaseModel):
    id: int
    task: str
    category: str
    priority: Literal["High", "Medium", "Low"]
    completed: bool = False

class KeyDateItem(BaseModel):
    event: str
    date_or_timeframe: str
    clause_reference: str

class LawyerQuestionItem(BaseModel):
    question: str
    context: str
    importance: str

class ActionPlan(BaseModel):
    document_name: str
    checklist: List[ChecklistItem]
    key_dates: List[KeyDateItem]
    lawyer_questions: List[LawyerQuestionItem]
