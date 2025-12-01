"""
Database initialization script for Rights 360
Run this script to create tables and populate with sample data
"""

from sqlalchemy.orm import Session
from database import engine, SessionLocal, create_tables
from models.user_model import User
from models.topic_model import LegalTopic, Quiz
from routers.auth import get_password_hash
import json

def create_sample_data():
    """Create sample legal topics and quizzes"""
    db = SessionLocal()
    
    try:
        # Create sample legal topics
        topics_data = [
            {
                "title": "Gender Rights",
                "slug": "gender-rights",
                "description": "Understanding your rights related to gender equality and protection against discrimination",
                "content": "Gender rights encompass the fundamental human rights that apply to all individuals regardless of their gender identity. These rights include equality before the law, freedom from discrimination, right to education, employment opportunities, and protection from violence. Understanding these rights helps create a more equitable society.",
                "category": "Civil Rights",
                "difficulty_level": "beginner",
                "tags": json.dumps(["gender", "equality", "discrimination", "rights"])
            },
            {
                "title": "Cyber Laws",
                "slug": "cyber-laws", 
                "description": "Digital rights and responsibilities in the online world",
                "content": "Cyber laws govern the digital realm and protect individuals from online crimes, harassment, and data breaches. Key areas include privacy protection, intellectual property rights, cyberbullying prevention, and digital financial security. These laws are essential for safe internet usage.",
                "category": "Technology Law",
                "difficulty_level": "intermediate",
                "tags": json.dumps(["cyber", "privacy", "online", "security", "digital"])
            },
            {
                "title": "Consumer Rights",
                "slug": "consumer-rights",
                "description": "Your rights when purchasing goods and services",
                "content": "Consumer rights protect buyers from unfair trade practices, defective products, and misleading advertisements. Key rights include the right to safety, right to information, right to choose, right to be heard, and right to redress. These rights ensure fair treatment in the marketplace.",
                "category": "Consumer Protection",
                "difficulty_level": "beginner", 
                "tags": json.dumps(["consumer", "purchase", "rights", "protection", "marketplace"])
            }
        ]
        
        for topic_data in topics_data:
            existing_topic = db.query(LegalTopic).filter(LegalTopic.slug == topic_data["slug"]).first()
            if not existing_topic:
                topic = LegalTopic(**topic_data)
                db.add(topic)
        
        db.commit()
        
        # Create sample quizzes
        quizzes_data = [
            {
                "topic_id": 1,  # Gender Rights
                "question": "What is the main purpose of gender rights?",
                "options": json.dumps([
                    "To provide special privileges to women",
                    "To ensure equality and protection from discrimination", 
                    "To limit men's rights",
                    "None of the above"
                ]),
                "correct_answer": 1,
                "explanation": "Gender rights aim to ensure equality and protection from discrimination for all genders, not to provide special privileges or limit anyone's rights.",
                "difficulty": "easy"
            },
            {
                "topic_id": 2,  # Cyber Laws  
                "question": "Which of the following is a primary concern of cyber privacy laws?",
                "options": json.dumps([
                    "Increasing internet speed",
                    "Protecting personal data and information",
                    "Reducing website loading times", 
                    "Enhancing social media features"
                ]),
                "correct_answer": 1,
                "explanation": "Cyber privacy laws primarily focus on protecting personal data and information from unauthorized access and misuse.",
                "difficulty": "medium"
            },
            {
                "topic_id": 3,  # Consumer Rights
                "question": "Which right allows consumers to make informed purchasing decisions?",
                "options": json.dumps([
                    "Right to safety",
                    "Right to information", 
                    "Right to be heard",
                    "Right to redress"
                ]),
                "correct_answer": 1,
                "explanation": "The right to information ensures consumers receive accurate and complete information about products and services to make informed decisions.",
                "difficulty": "easy"
            }
        ]
        
        for quiz_data in quizzes_data:
            # Check if quiz already exists for this topic
            existing_quiz = db.query(Quiz).filter(
                Quiz.topic_id == quiz_data["topic_id"],
                Quiz.question == quiz_data["question"]
            ).first()
            
            if not existing_quiz:
                quiz = Quiz(**quiz_data)
                db.add(quiz)
        
        db.commit()
        print("✅ Sample data created successfully!")
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Initializing Rights 360 Database...")
    create_tables()
    print("✅ Database tables created!")
    create_sample_data()
    print("🎉 Database initialization complete!")
