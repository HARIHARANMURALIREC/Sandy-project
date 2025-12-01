from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel

from database import get_db
from models.user_model import User, UserProgress
from models.topic_model import LegalTopic
from routers.auth import get_current_user
from services.gemini_service import gemini_service

router = APIRouter()

class TopicResponse(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    content: str
    difficulty_level: str
    category: str
    tags: str
    is_published: bool
    
    class Config:
        from_attributes = True

class UserProgressResponse(BaseModel):
    topic_id: int
    completed: bool
    progress_percentage: int
    last_accessed: str

class ProgressUpdate(BaseModel):
    progress_percentage: int
    completed: bool = False

@router.get("/topics", response_model=List[TopicResponse])
def get_legal_topics(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all published legal topics with optional filtering"""
    query = db.query(LegalTopic).filter(LegalTopic.is_published == True)
    
    if category:
        query = query.filter(LegalTopic.category == category)
    if difficulty:
        query = query.filter(LegalTopic.difficulty_level == difficulty)
    
    return query.all()

@router.get("/topics/{slug}", response_model=TopicResponse)
def get_topic_by_slug(
    slug: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific legal topic by slug"""
    topic = db.query(LegalTopic).filter(
        LegalTopic.slug == slug,
        LegalTopic.is_published == True
    ).first()
    
    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )
    
    # Update user progress
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.topic_id == topic.id
    ).first()
    
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            topic_id=topic.id,
            progress_percentage=0,
            completed=False
        )
        db.add(progress)
    else:
        progress.last_accessed = func.now()
    
    db.commit()
    
    return topic

@router.post("/topics/{topic_id}/progress", response_model=UserProgressResponse)
def update_topic_progress(
    topic_id: int,
    progress_data: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user progress for a topic"""
    # Verify topic exists
    topic = db.query(LegalTopic).filter(LegalTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )
    
    # Get or create user progress
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.topic_id == topic_id
    ).first()
    
    if not progress:
        progress = UserProgress(
            user_id=current_user.id,
            topic_id=topic_id
        )
        db.add(progress)
    
    progress.progress_percentage = progress_data.progress_percentage
    progress.completed = progress_data.completed
    
    db.commit()
    db.refresh(progress)
    
    return UserProgressResponse(
        topic_id=topic_id,
        completed=progress.completed,
        progress_percentage=progress.progress_percentage,
        last_accessed=progress.last_accessed.isoformat()
    )

@router.get("/user/progress", response_model=List[UserProgressResponse])
def get_user_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's progress across all topics"""
    progress_records = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).all()
    
    return [
        UserProgressResponse(
            topic_id=p.topic_id,
            completed=p.completed,
            progress_percentage=p.progress_percentage,
            last_accessed=p.last_accessed.isoformat()
        )
        for p in progress_records
    ]

@router.get("/categories")
def get_topic_categories(db: Session = Depends(get_db)):
    """Get all available topic categories"""
    categories = db.query(LegalTopic.category).filter(
        LegalTopic.is_published == True
    ).distinct().all()
    
    return [category[0] for category in categories]
