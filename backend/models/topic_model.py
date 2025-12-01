from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class LegalTopic(Base):
    __tablename__ = "legal_topics"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=False)  # AI-generated simplified content
    difficulty_level = Column(String(20), default="beginner")  # beginner, intermediate, advanced
    category = Column(String(100), nullable=False)
    tags = Column(String(500), nullable=True)  # JSON string of tags
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    quizzes = relationship("Quiz", back_populates="topic")
    user_progress = relationship("UserProgress", back_populates="topic")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("legal_topics.id"), nullable=False)
    question = Column(Text, nullable=False)
    options = Column(Text, nullable=False)  # JSON string of answer options
    correct_answer = Column(Integer, nullable=False)  # Index of correct option (0-based)
    explanation = Column(Text, nullable=True)
    difficulty = Column(String(20), default="easy")  # easy, medium, hard
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    topic = relationship("LegalTopic", back_populates="quizzes")
    quiz_results = relationship("QuizResult", back_populates="quiz")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    selected_answer = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    time_taken = Column(Integer, nullable=True)  # Time taken in seconds
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="quiz_results")
    quiz = relationship("Quiz", back_populates="quiz_results")
