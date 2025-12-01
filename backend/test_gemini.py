"""
Test script to verify Gemini API configuration
Run this to test if your API key is working correctly
"""

import os
import asyncio
from dotenv import load_dotenv
from services.gemini_service import gemini_service

# Load environment variables from .env file
load_dotenv()

async def test_gemini_api():
    """Test the Gemini API configuration"""
    try:
        print("🧪 Testing Gemini API configuration...")
        print(f"API Key configured: {'✅' if os.getenv('GEMINI_API_KEY') else '❌'}")
        
        # Test a simple legal question
        response = await gemini_service.answer_legal_question(
            "What are consumer rights?", 
            "Testing the API connection"
        )
        
        print("\n🤖 AI Response:")
        print("-" * 50)
        print(response)
        print("-" * 50)
        print("\n✅ Gemini API is working correctly!")
        
    except Exception as e:
        print(f"\n❌ Error testing Gemini API: {str(e)}")
        print("\n💡 Make sure to:")
        print("1. Copy env.example to .env")
        print("2. Set GEMINI_API_KEY in your .env file")
        print("3. Install requirements: pip install -r requirements.txt")

if __name__ == "__main__":
    asyncio.run(test_gemini_api())
