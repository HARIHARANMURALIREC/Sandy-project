# Rights 360 - Legal Literacy & Empowerment Platform

Rights 360 is a global legal literacy and empowerment platform that makes legal knowledge accessible, interactive, and inclusive for everyone.

## 🌍 Mission
Educate users about their rights and responsibilities through simple explanations, interactive learning, quizzes, gamified experiences, and voice-guided support.

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js (TypeScript, App Router)
- **Styling**: Tailwind CSS + ShadCN/UI
- **Animations**: Framer Motion
- **i18n**: react-i18next
- **Authentication**: NextAuth.js
- **State Management**: Zustand

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB Atlas
- **AI Engine**: Gemini API
- **Authentication**: JWT-based auth

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Google Cloud account (for Gemini API) - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Step 1: Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create and activate virtual environment (if not already created):**
```bash
# On macOS/Linux:
python3 -m venv rights360_env
source rights360_env/bin/activate

# On Windows:
python -m venv rights360_env
rights360_env\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
# Copy the example env file
cp env.example .env

# Edit .env file and add your Gemini API key:
# GEMINI_API_KEY=your-actual-api-key-here
```

5. **Initialize the database:**
```bash
python init_db.py
```

6. **Start the backend server:**
```bash
# Option 1: Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Option 2: Using Python (as configured in main.py)
python main.py
```

The backend will be running at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Copy the example env file
cp env.example .env.local

# Edit .env.local and configure:
# - NEXTAUTH_SECRET (generate a random string)
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (if using Google OAuth)
# - NEXT_PUBLIC_API_URL should be http://localhost:8000
```

4. **Start the frontend development server:**
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`

### Step 3: Access the Application

- **Frontend**: Open your browser and go to `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **API Docs (Swagger)**: `http://localhost:8000/docs`
- **API Docs (ReDoc)**: `http://localhost:8000/redoc`

### Quick Start (Both Servers)

To run both servers simultaneously, you can:

**Terminal 1 (Backend):**
```bash
cd backend
source rights360_env/bin/activate  # On Windows: rights360_env\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 📂 Project Structure

```
rights360-platform/
├── frontend/              # Next.js web app
├── backend/               # FastAPI backend
└── README.md
```

## 🧩 Core Features

- 🔐 Authentication (Email + Google)
- 📊 User Dashboard with progress tracking
- 📚 Learn modules with AI-generated summaries
- 🧠 Interactive quizzes with gamification
- 🤖 AI Legal Assistant with voice support
- 🌍 Multilingual support (EN, HI, TA)
- ♿ Accessibility features

## 🔧 Environment Variables

See `.env.example` files in both frontend and backend directories.

### Backend Environment Variables (.env)
- `DATABASE_URL`: SQLite database path (default: `sqlite:///./rights360.db`)
- `SECRET_KEY`: JWT secret key for token generation
- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI features)
- `ALLOWED_ORIGINS`: CORS allowed origins (default: `http://localhost:3000`)

### Frontend Environment Variables (.env.local)
- `NEXTAUTH_URL`: Your app URL (default: `http://localhost:3000`)
- `NEXTAUTH_SECRET`: Secret for NextAuth.js (generate a random string)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret (optional)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:8000`)

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Change the port in main.py or use:
uvicorn main:app --reload --port 8001
```

**Database errors:**
```bash
# Delete the database and reinitialize:
rm rights360.db
python init_db.py
```

**Module not found errors:**
```bash
# Make sure virtual environment is activated and dependencies are installed:
source rights360_env/bin/activate
pip install -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
# Next.js will automatically use the next available port (3001, 3002, etc.)
```

**API connection errors:**
- Verify backend is running on `http://localhost:8000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in backend `main.py`

**NextAuth errors:**
- Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Ensure `.env.local` file exists (not `.env`)

## 📄 License

MIT License
