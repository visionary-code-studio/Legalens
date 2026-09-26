import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True, index=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer, default=0)
    upload_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="processed")
    full_text = Column(Text, default="")
    encrypted_payload = Column(Text, nullable=True)

    user = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    clauses = relationship("ExtractedClause", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(64), primary_key=True, index=True)
    document_id = Column(String(64), ForeignKey("documents.id"), nullable=False)
    section = Column(String(100), default="General")
    heading = Column(String(255), default="")
    text = Column(Text, nullable=False)
    jurisdiction = Column(String(10), default="IN")

    document = relationship("Document", back_populates="chunks")

class ExtractedClause(Base):
    __tablename__ = "extracted_clauses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(64), ForeignKey("documents.id"), nullable=False)
    clause_title = Column(String(150), nullable=False)
    clause_type = Column(String(50), default="other")
    risk_level = Column(String(20), default="Low Risk")
    meaning = Column(Text, default="")
    who_it_affects = Column(String(100), default="")
    key_obligations = Column(JSON, default=list)
    potential_concerns = Column(JSON, default=list)
    relevant_section = Column(String(100), default="")
    page_number = Column(Integer, default=1)

    document = relationship("Document", back_populates="clauses")

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), default="Vaibhav Shaw")
    phone = Column(String(30), default="+91 98765 43210")
    organization = Column(String(150), default="Legal Aid Cell & Civic Research")
    role = Column(String(100), default="Legal Advocate & Researcher")
    plan = Column(String(50), default="Free Plan")
    preferred_language = Column(String(50), default="Hindi (हिन्दी)")
    avatar_initials = Column(String(5), default="V")
    documents_analyzed = Column(Integer, default=14)
    queries_asked = Column(Integer, default=38)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), default="system")  # "document", "statutory", "security", "translation"
    action_url = Column(String(255), default="/dashboard")
    is_read = Column(Integer, default=0)  # 0: unread, 1: read
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
