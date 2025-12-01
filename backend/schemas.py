from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Module schemas
class ModuleBase(BaseModel):
    title: str
    description: str
    content: str

class ModuleCreate(ModuleBase):
    pass

class ModuleUpdate(ModuleBase):
    pass

class ModuleResponse(ModuleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Quiz schemas
class QuizBase(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str

class QuizCreate(QuizBase):
    module_id: int

class QuizResponse(BaseModel):
    id: int
    module_id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    quiz_id: int
    selected_answer: str

class QuizSubmissionBulk(BaseModel):
    module_id: int
    answers: List[QuizSubmission]

# Progress schemas
class ProgressResponse(BaseModel):
    id: int
    user_id: int
    module_id: int
    module_title: Optional[str] = None
    score: float
    completed: bool
    completed_at: datetime

    class Config:
        from_attributes = True

class UserProgressSummary(BaseModel):
    total_modules: int
    completed_modules: int
    average_score: float
    progress_details: List[ProgressResponse]
