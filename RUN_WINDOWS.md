# Running Rights 360 on Windows

## Quick Start Commands

### Terminal 1 - Backend

```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install --upgrade pip
pip install fastapi uvicorn[standard] sqlalchemy alembic python-jose[cryptography] passlib[bcrypt] python-multipart google-generativeai "pydantic>=2.5.0,<2.9.0" pydantic-settings python-decouple httpx email-validator bcrypt pytest pytest-asyncio python-dotenv
copy env.example .env
python init_db.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend

```cmd
cd frontend
npm install
copy env.example .env.local
npm run dev
```

## Access the Application

- Frontend: http://localhost:3000 (or next available port)
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

