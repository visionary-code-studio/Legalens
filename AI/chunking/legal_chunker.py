import re
from typing import List, Dict, Any

class LegalDocumentChunker:
    """
    Production Structure-Aware Legal Chunker.
    Optimized for Indian & International contracts, statutes, agreements, and legal notices.
    Accurately recognizes:
    - Section / Clause / Article headers (e.g., 'Clause 4: Confidentiality')
    - Numbered provisions (e.g., '1. Definitions', '2.3 Termination for Breach')
    - Recitals & Schedules ('WHEREAS', 'SCHEDULE A', 'ANNEXURE I')
    - Sub-clauses ('(a)', '(b)', '(i)', '(ii)')
    - Semantic boundary windowing with token/word budget control.
    """

    PATTERNS = [
        # Explicit section/clause/article
        re.compile(r'^(?:SECTION|CLAUSE|ARTICLE)\s+([0-9A-Za-z\.\-]+)[\:\.\s]+([^\n]*)', re.IGNORECASE),
        # Numbered headings e.g. "1. Confidentiality" or "3.2 Non-Compete"
        re.compile(r'^([0-9]{1,2}(?:\.[0-9]{1,2})?)\.?\s+([A-Z][A-Za-z0-9\s,\-–—/\(\)]{2,70})$'),
        # Structural divisions e.g. "SCHEDULE A: FEES", "WHEREAS", "ANNEXURE 1"
        re.compile(r'^(WHEREAS|NOW THEREFORE|SCHEDULE\s+[A-Z0-9]+|ANNEXURE\s+[A-Z0-9]+|EXHIBIT\s+[A-Z0-9]+)[\:\.\s]*(.*)', re.IGNORECASE),
    ]

    def __init__(self, max_chars_per_chunk: int = 1800, min_chars_per_chunk: int = 150, overlap_chars: int = 180):
        self.max_chars_per_chunk = max_chars_per_chunk
        self.min_chars_per_chunk = min_chars_per_chunk
        self.overlap_chars = overlap_chars

    def _match_heading(self, line: str):
        trimmed = line.strip()
        if not trimmed or len(trimmed) > 120:
            return None

        for pattern in self.PATTERNS:
            m = pattern.match(trimmed)
            if m:
                groups = m.groups()
                section_id = groups[0].strip() if len(groups) > 0 and groups[0] else "Section"
                title = groups[1].strip() if len(groups) > 1 and groups[1] else section_id
                return section_id, title
        return None

    def chunk_document(self, document_id: str, full_text: str, document_name: str) -> List[Dict[str, Any]]:
        chunks: List[Dict[str, Any]] = []
        if not full_text or not full_text.strip():
            return chunks

        lines = full_text.splitlines()
        current_section = "Preamble"
        current_heading = "Preliminary Terms"
        current_buffer: List[str] = []
        chunk_index = 0

        def flush_buffer(sec: str, head: str):
            nonlocal chunk_index
            text = "\n".join(current_buffer).strip()
            if not text:
                return

            # If the text is larger than max chunk size, break down into overlapping pieces
            if len(text) > self.max_chars_per_chunk:
                paragraphs = text.split("\n\n")
                sub_buf = ""
                for p in paragraphs:
                    if len(sub_buf) + len(p) > self.max_chars_per_chunk and len(sub_buf) >= self.min_chars_per_chunk:
                        chunks.append({
                            "chunk_id": f"{document_id}_chk_{chunk_index}",
                            "document_id": document_id,
                            "document_name": document_name,
                            "section": sec,
                            "heading": head,
                            "text": sub_buf.strip(),
                            "jurisdiction": "IN"
                        })
                        chunk_index += 1
                        # Maintain overlap
                        sub_buf = sub_buf[-self.overlap_chars:] + "\n\n" + p
                    else:
                        sub_buf = (sub_buf + "\n\n" + p).strip()

                if sub_buf.strip():
                    chunks.append({
                        "chunk_id": f"{document_id}_chk_{chunk_index}",
                        "document_id": document_id,
                        "document_name": document_name,
                        "section": sec,
                        "heading": head,
                        "text": sub_buf.strip(),
                        "jurisdiction": "IN"
                    })
                    chunk_index += 1
            else:
                chunks.append({
                    "chunk_id": f"{document_id}_chk_{chunk_index}",
                    "document_id": document_id,
                    "document_name": document_name,
                    "section": sec,
                    "heading": head,
                    "text": text,
                    "jurisdiction": "IN"
                })
                chunk_index += 1

        for line in lines:
            heading_match = self._match_heading(line)
            if heading_match:
                # If we hit a new heading and have text in buffer, flush
                if len("\n".join(current_buffer).strip()) >= self.min_chars_per_chunk:
                    flush_buffer(current_section, current_heading)
                    current_buffer = []

                sec_id, head_title = heading_match
                current_section = f"Section {sec_id}" if not sec_id.lower().startswith("section") else sec_id
                current_heading = head_title or current_section

            current_buffer.append(line)

        # Flush any remaining buffer
        if current_buffer:
            flush_buffer(current_section, current_heading)

        # Fallback safeguard: If text had no headings and only 1 chunk was created but text is large
        if len(chunks) <= 1 and len(full_text) > self.max_chars_per_chunk:
            chunks = []
            chunk_index = 0
            paragraphs = [p.strip() for p in full_text.split("\n\n") if p.strip()]
            sub_buf = ""
            for p in paragraphs:
                if len(sub_buf) + len(p) > self.max_chars_per_chunk and len(sub_buf) >= self.min_chars_per_chunk:
                    chunks.append({
                        "chunk_id": f"{document_id}_chk_{chunk_index}",
                        "document_id": document_id,
                        "document_name": document_name,
                        "section": f"Part {chunk_index + 1}",
                        "heading": f"Provisions Part {chunk_index + 1}",
                        "text": sub_buf.strip(),
                        "jurisdiction": "IN"
                    })
                    chunk_index += 1
                    sub_buf = sub_buf[-self.overlap_chars:] + "\n\n" + p
                else:
                    sub_buf = (sub_buf + "\n\n" + p).strip()

            if sub_buf.strip():
                chunks.append({
                    "chunk_id": f"{document_id}_chk_{chunk_index}",
                    "document_id": document_id,
                    "document_name": document_name,
                    "section": f"Part {chunk_index + 1}",
                    "heading": f"Provisions Part {chunk_index + 1}",
                    "text": sub_buf.strip(),
                    "jurisdiction": "IN"
                })

        return chunks
