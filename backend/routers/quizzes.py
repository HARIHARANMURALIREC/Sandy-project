from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import json
import random

from database import get_db
from models.user_model import User
from models.topic_model import Quiz, QuizResult, LegalTopic
from routers.auth import get_current_user

router = APIRouter()

class QuizResponse(BaseModel):
    id: int
    topic_id: int
    question: str
    options: List[str]
    explanation: Optional[str] = None
    difficulty: str
    
    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    quiz_id: int
    selected_answer: int
    time_taken: Optional[int] = None

class QuizResultResponse(BaseModel):
    is_correct: bool
    correct_answer: int
    explanation: Optional[str] = None
    score: int

@router.get("/random", response_model=QuizResponse)
def get_random_quiz(
    topic_id: Optional[int] = None,
    difficulty: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a random quiz question"""
    query = db.query(Quiz)
    
    if topic_id:
        # Verify topic exists
        topic = db.query(LegalTopic).filter(LegalTopic.id == topic_id).first()
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
        query = query.filter(Quiz.topic_id == topic_id)
    
    if difficulty:
        query = query.filter(Quiz.difficulty == difficulty)
    
    quizzes = query.all()
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found")
    
    # Select random quiz
    quiz = random.choice(quizzes)
    
    # Parse options from JSON
    try:
        options = json.loads(quiz.options)
    except json.JSONDecodeError:
        options = []
    
    return QuizResponse(
        id=quiz.id,
        topic_id=quiz.topic_id,
        question=quiz.question,
        options=options,
        explanation=quiz.explanation,
        difficulty=quiz.difficulty
    )

@router.get("/topic/{topic_id}", response_model=List[QuizResponse])
def get_quizzes_by_topic(
    topic_id: int,
    difficulty: Optional[str] = None,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get quizzes for a specific topic"""
    # Verify topic exists
    topic = db.query(LegalTopic).filter(LegalTopic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    query = db.query(Quiz).filter(Quiz.topic_id == topic_id)
    
    if difficulty:
        query = query.filter(Quiz.difficulty == difficulty)
    
    quizzes = query.limit(limit).all()
    
    results = []
    for quiz in quizzes:
        try:
            options = json.loads(quiz.options)
        except json.JSONDecodeError:
            options = []
        
        results.append(QuizResponse(
            id=quiz.id,
            topic_id=quiz.topic_id,
            question=quiz.question,
            options=options,
            explanation=quiz.explanation,
            difficulty=quiz.difficulty
        ))
    
    return results

@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz_answer(
    submission: QuizSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a quiz answer and get results"""
    # Get the quiz
    quiz = db.query(Quiz).filter(Quiz.id == submission.quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Parse options to validate selected answer
    try:
        options = json.loads(quiz.options)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid quiz format")
    
    if submission.selected_answer < 0 or submission.selected_answer >= len(options):
        raise HTTPException(status_code=400, detail="Invalid answer selection")
    
    # Check if correct
    is_correct = submission.selected_answer == quiz.correct_answer
    
    # Save result
    quiz_result = QuizResult(
        user_id=current_user.id,
        quiz_id=submission.quiz_id,
        selected_answer=submission.selected_answer,
        is_correct=is_correct,
        time_taken=submission.time_taken
    )
    db.add(quiz_result)
    db.commit()
    
    return QuizResultResponse(
        is_correct=is_correct,
        correct_answer=quiz.correct_answer,
        explanation=quiz.explanation,
        score=1 if is_correct else 0
    )

@router.get("/results", response_model=List[dict])
def get_user_quiz_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's quiz results"""
    results = db.query(QuizResult).filter(
        QuizResult.user_id == current_user.id
    ).all()
    
    return [
        {
            "quiz_id": result.quiz_id,
            "is_correct": result.is_correct,
            "selected_answer": result.selected_answer,
            "time_taken": result.time_taken,
            "created_at": result.created_at.isoformat()
        }
        for result in results
    ]
