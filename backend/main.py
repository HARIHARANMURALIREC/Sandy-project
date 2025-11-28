from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from database import engine, get_db, Base
from models import User, Module, Quiz, Progress
from schemas import (
    UserCreate, UserLogin, Token, UserResponse,
    ModuleCreate, ModuleUpdate, ModuleResponse,
    QuizCreate, QuizResponse, QuizSubmissionBulk,
    ProgressResponse, UserProgressSummary
)
from auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Rights 360 API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AUTH ENDPOINTS ====================

@app.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@app.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == user_data.username).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        if not verify_password(user_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )

@app.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# ==================== MODULE ENDPOINTS ====================

@app.get("/modules", response_model=List[ModuleResponse])
def get_modules(db: Session = Depends(get_db)):
    modules = db.query(Module).all()
    return modules

@app.get("/modules/{module_id}", response_model=ModuleResponse)
def get_module(module_id: int, db: Session = Depends(get_db)):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return module

@app.post("/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
def create_module(
    module_data: ModuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    new_module = Module(**module_data.dict())
    db.add(new_module)
    db.commit()
    db.refresh(new_module)
    return new_module

# ==================== QUIZ ENDPOINTS ====================

@app.get("/quiz/{module_id}", response_model=List[QuizResponse])
def get_module_quizzes(module_id: int, db: Session = Depends(get_db)):
    # Verify module exists
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    quizzes = db.query(Quiz).filter(Quiz.module_id == module_id).all()
    return quizzes

@app.post("/quiz/submit")
def submit_quiz(
    submission: QuizSubmissionBulk,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all quizzes for this module
    quizzes = db.query(Quiz).filter(Quiz.module_id == submission.module_id).all()
    if not quizzes:
        raise HTTPException(status_code=404, detail="No quizzes found for this module")
    
    # Calculate score
    total_questions = len(quizzes)
    correct_answers = 0
    
    for answer in submission.answers:
        quiz = db.query(Quiz).filter(Quiz.id == answer.quiz_id).first()
        if quiz and quiz.correct_answer == answer.selected_answer:
            correct_answers += 1
    
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    
    # Check if progress already exists
    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.module_id == submission.module_id
    ).first()
    
    if progress:
        # Update existing progress
        progress.score = score
        progress.completed = True
    else:
        # Create new progress
        progress = Progress(
            user_id=current_user.id,
            module_id=submission.module_id,
            score=score,
            completed=True
        )
        db.add(progress)
    
    db.commit()
    db.refresh(progress)
    
    return {
        "score": score,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "passed": score >= 60
    }

# ==================== PROGRESS ENDPOINTS ====================

@app.get("/user/progress/{user_id}", response_model=UserProgressSummary)
def get_user_progress(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Users can only view their own progress unless they're admin
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get all progress for user
    progress_records = db.query(Progress).filter(Progress.user_id == user_id).all()
    
    # Get total modules
    total_modules = db.query(Module).count()
    completed_modules = len([p for p in progress_records if p.completed])
    
    # Calculate average score
    if progress_records:
        average_score = sum(p.score for p in progress_records) / len(progress_records)
    else:
        average_score = 0.0
    
    # Enrich progress with module titles
    progress_details = []
    for p in progress_records:
        module = db.query(Module).filter(Module.id == p.module_id).first()
        progress_details.append({
            "id": p.id,
            "user_id": p.user_id,
            "module_id": p.module_id,
            "module_title": module.title if module else "Unknown",
            "score": p.score,
            "completed": p.completed,
            "completed_at": p.completed_at
        })
    
    return {
        "total_modules": total_modules,
        "completed_modules": completed_modules,
        "average_score": round(average_score, 2),
        "progress_details": progress_details
    }

@app.get("/")
def root():
    return {
        "message": "Rights 360 API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
