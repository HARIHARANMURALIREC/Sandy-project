from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from models.user_model import User
from routers.auth import get_current_user
from services.gemini_service import gemini_service

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    success: bool

class LegalTopicRequest(BaseModel):
    topic: str
    complexity_level: Optional[str] = "simple"

class TopicResponse(BaseModel):
    explanation: str
    success: bool

@router.post("/assistant", response_model=ChatResponse)
async def chat_with_assistant(
    chat_request: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Chat with the AI legal assistant"""
    try:
        response = await gemini_service.answer_legal_question(
            question=chat_request.message,
            context=chat_request.context or ""
        )
        return ChatResponse(response=response, success=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing your request: {str(e)}"
        )

@router.post("/explain-topic", response_model=TopicResponse)
async def explain_legal_topic(
    topic_request: LegalTopicRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get AI-generated explanation for a legal topic"""
    try:
        explanation = await gemini_service.generate_legal_explanation(
            topic=topic_request.topic,
            complexity_level=topic_request.complexity_level
        )
        return TopicResponse(explanation=explanation, success=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating explanation: {str(e)}"
        )

@router.post("/summarize", response_model=ChatResponse)
async def summarize_document(
    document_data: dict,  # {"text": "document content"}
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Summarize a legal document"""
    try:
        document_text = document_data.get("text", "")
        if not document_text:
            raise HTTPException(
                status_code=400,
                detail="Document text is required"
            )
        
        summary = await gemini_service.summarize_legal_document(document_text)
        return ChatResponse(response=summary, success=True)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error summarizing document: {str(e)}"
        )
