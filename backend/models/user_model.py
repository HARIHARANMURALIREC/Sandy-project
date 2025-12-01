from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=True)  # Nullable for OAuth users
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # OAuth fields
    google_id = Column(String(100), unique=True, nullable=True)
    avatar_url = Column(String(255), nullable=True)
    
    # User preferences
    preferred_language = Column(String(10), default="en")
    is_dark_mode = Column(Boolean, default=False)
    
    # Relationships
    quiz_results = relationship("QuizResult", back_populates="user")
    user_progress = relationship("UserProgress", back_populates="user")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("legal_topics.id"), nullable=False)
    completed = Column(Boolean, default=False)
    progress_percentage = Column(Integer, default=0)
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_progress")
    topic = relationship("LegalTopic", back_populates="user_progress")
