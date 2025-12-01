import os
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path
# Note: google.generativeai import removed - AI is completely disabled

# Get the backend directory path
BACKEND_DIR = Path(__file__).parent.parent
ENV_FILE = BACKEND_DIR / ".env"

# Load environment variables with explicit path
load_dotenv(dotenv_path=ENV_FILE, override=True)

def get_api_key():
    """Get API key from environment, reloading if needed"""
    # First try environment variable (might be set externally)
    key = os.getenv("GEMINI_API_KEY")
    
    if not key:
        # Reload .env file with explicit path
        load_dotenv(dotenv_path=ENV_FILE, override=True)
        key = os.getenv("GEMINI_API_KEY")
    
    if not key:
        # Last attempt: try reading directly from .env file
        try:
            if ENV_FILE.exists():
                with open(ENV_FILE, 'r') as f:
                    for line in f:
                        if line.startswith('GEMINI_API_KEY='):
                            key = line.split('=', 1)[1].strip()
                            # Remove quotes if present
                            key = key.strip('"').strip("'")
                            break
        except Exception:
            pass
    
    if not key:
        raise ValueError(f"GEMINI_API_KEY environment variable is required. Check {ENV_FILE}")
    
    return key

class GeminiService:
    # Common questions with pre-written answers for fast responses
    COMMON_QUESTIONS = {
        "what are my consumer rights": """Consumer rights are fundamental protections that ensure fair treatment when purchasing goods and services. Key rights include:

1. **Right to Safety**: Products should not harm you or your family
2. **Right to Information**: You must receive accurate details about products, prices, and terms
3. **Right to Choose**: You have the freedom to select from various products at competitive prices
4. **Right to be Heard**: You can file complaints and expect them to be addressed
5. **Right to Redress**: You're entitled to compensation for defective products or poor service

If you receive a defective product, you can return it within the warranty period. For unfair trade practices, you can file a complaint with consumer protection authorities. Always keep receipts and documentation.""",

        "what are my rights as a tenant": """As a tenant, you have several important rights:

1. **Right to Habitable Living**: Your landlord must provide a safe, clean, and livable property
2. **Right to Privacy**: Landlords cannot enter without proper notice (usually 24-48 hours)
3. **Right to Security Deposit Protection**: Your deposit should be returned (minus damages) when you move out
4. **Right to Fair Treatment**: Protection against discrimination based on race, religion, gender, etc.
5. **Right to Repairs**: Landlords must fix essential issues like plumbing, heating, and safety hazards

If your landlord violates these rights, document everything and contact local tenant rights organizations or housing authorities for assistance.""",

        "what is cyberbullying": """Cyberbullying is the use of digital technology (social media, messaging, email) to harass, threaten, or humiliate someone. It includes:

- Sending threatening or abusive messages
- Spreading false rumors online
- Sharing embarrassing photos or videos without consent
- Creating fake profiles to impersonate someone
- Excluding someone from online groups intentionally

**What you can do:**
1. Don't respond to the bully
2. Save all evidence (screenshots, messages)
3. Block the person on all platforms
4. Report to the platform (social media sites have reporting features)
5. Tell a trusted adult or authority figure
6. Contact law enforcement if threats are serious

Many countries have laws against cyberbullying, and it can result in criminal charges. Remember: you're not alone, and help is available.""",

        "what are my employee rights": """As an employee, you have fundamental rights including:

1. **Right to Fair Wages**: Minimum wage and overtime pay as per labor laws
2. **Right to Safe Workplace**: Your employer must provide a safe working environment
3. **Right to Equal Opportunity**: Protection against discrimination (age, gender, race, religion, disability)
4. **Right to Privacy**: Personal information should be kept confidential
5. **Right to Organize**: Freedom to join unions and engage in collective bargaining
6. **Right to Leave**: Entitlement to sick leave, vacation, and maternity/paternity leave as per law

If your rights are violated, document incidents, report to HR, and contact labor authorities or employment lawyers for assistance.""",

        "what is a contract": """A contract is a legally binding agreement between two or more parties. For it to be valid, it needs:

1. **Offer**: One party proposes terms
2. **Acceptance**: The other party agrees to those terms
3. **Consideration**: Something of value is exchanged (money, services, goods)
4. **Legal Capacity**: Both parties must be legally able to enter contracts (adults, mentally competent)
5. **Legal Purpose**: The agreement must be for a lawful purpose

**Important points:**
- Written contracts are easier to enforce, but verbal contracts can also be valid
- Read contracts carefully before signing
- You can't be forced to sign under duress or threat
- If a contract is unfair or illegal, it may not be enforceable

Always keep copies of contracts and consult a lawyer for complex agreements.""",

        "what is intellectual property": """Intellectual Property (IP) refers to creations of the mind that have legal protection:

1. **Copyright**: Protects creative works (books, music, art, software) - lasts for author's lifetime + 50-70 years
2. **Trademark**: Protects brand names, logos, slogans (e.g., company logos)
3. **Patent**: Protects inventions and processes (usually 20 years)
4. **Trade Secret**: Protects confidential business information (recipes, formulas)

**Your rights:**
- You own the IP you create
- Others cannot use it without permission
- You can license or sell your IP
- You can take legal action if someone infringes your IP

**To protect your IP:**
- Register copyrights, trademarks, or patents
- Use proper notices (©, ™, ®)
- Keep records of creation dates
- Consider professional legal advice for valuable IP"""
    }
    
    def __init__(self):
        # Don't store API key, always get it fresh
        self._model_name = None
        self.model = None
        # AI is completely disabled - only common questions are used
        # No model initialization needed
    
    def _initialize_model(self):
        """AI is disabled - this method is not used anymore"""
        # AI is completely disabled - no model initialization
        self.model = None
        self._model_name = None
    
    def _ensure_api_key(self):
        """AI is disabled - this method is not used anymore"""
        # AI is completely disabled - no API calls
        pass
    
    async def generate_legal_explanation(self, topic: str, complexity_level: str = "simple") -> str:
        """Generate a simplified legal explanation using common questions cache"""
        # Check if topic matches a common question
        common_answer = self._check_common_questions(f"what is {topic}")
        if common_answer:
            return common_answer + "\n\n*Note: This is general information. For specific legal matters, please consult with a qualified lawyer.*"
        
        # If not found, suggest available topics
        return """I can provide instant explanations for these legal topics:

**Available Topics:**
• Consumer Rights
• Tenant Rights  
• Employee Rights
• Cyberbullying
• Contracts
• Intellectual Property

Please ask about one of these topics for an instant explanation!"""
    
    def _check_common_questions(self, question: str) -> Optional[str]:
        """Check if question matches a common question and return pre-written answer"""
        question_lower = question.lower().strip()
        
        # Check for exact or close matches
        for common_q, answer in self.COMMON_QUESTIONS.items():
            if common_q in question_lower or question_lower in common_q:
                return answer
        
        # Check for keyword matches
        keywords = {
            "consumer rights": self.COMMON_QUESTIONS["what are my consumer rights"],
            "tenant rights": self.COMMON_QUESTIONS["what are my rights as a tenant"],
            "employee rights": self.COMMON_QUESTIONS["what are my employee rights"],
            "cyberbullying": self.COMMON_QUESTIONS["what is cyberbullying"],
            "contract": self.COMMON_QUESTIONS["what is a contract"],
            "intellectual property": self.COMMON_QUESTIONS["what is intellectual property"],
        }
        
        for keyword, answer in keywords.items():
            if keyword in question_lower:
                return answer
        
        return None
    
    async def answer_legal_question(self, question: str, context: str = "") -> str:
        """Answer a legal question in simple terms"""
        # First check if it's a common question for instant response
        common_answer = self._check_common_questions(question)
        if common_answer:
            return common_answer + "\n\n*Note: This is general information. For specific legal matters, please consult with a qualified lawyer.*"
        
        # Only use common questions - no AI API calls
        return """I can help you with these common legal questions instantly:

**Available Topics:**
• **Consumer Rights** - Ask: "What are my consumer rights?"
• **Tenant Rights** - Ask: "What are my rights as a tenant?"
• **Employee Rights** - Ask: "What are my employee rights?"
• **Cyberbullying** - Ask: "What is cyberbullying?"
• **Contracts** - Ask: "What is a contract?"
• **Intellectual Property** - Ask: "What is intellectual property?"

Please try asking one of these questions for instant answers!"""
    
    async def summarize_legal_document(self, document_text: str) -> str:
        """Summarize a legal document - currently using common questions only"""
        return """Document summarization is currently available for these common legal topics:

**Available Topics:**
• Consumer Rights
• Tenant Rights
• Employee Rights
• Cyberbullying
• Contracts
• Intellectual Property

Please ask about one of these topics for detailed information!"""

# Global instance
gemini_service = GeminiService()
