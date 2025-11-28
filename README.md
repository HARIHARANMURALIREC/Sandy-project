# Rights 360 - Legal Literacy Platform

A comprehensive legal education platform that empowers users to learn about their fundamental rights, legal protections, and responsibilities as citizens.

## 🌟 Features

- **6 Comprehensive Legal Modules** covering fundamental rights, consumer protection, women's rights, labor rights, and more
- **30 Interactive Quizzes** (5 per module) to test knowledge
- **User Authentication** with JWT-based secure login
- **Progress Tracking** to monitor learning journey
- **Admin Dashboard** for content management
- **Modern UI** with dark/light mode support
- **Responsive Design** for all devices

## 🛠️ Tech Stack

### Backend
- **Python 3.13** with FastAPI
- **SQLAlchemy** ORM
- **SQLite** database
- **JWT** authentication
- **Uvicorn** ASGI server

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py  # Seed database with initial data
python main.py
```

Backend will run on: http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

## 📚 Available Modules

1. **Fundamental Rights** - Learn about basic constitutional rights
2. **Right to Life and Personal Liberty** - Understand Article 21 protections
3. **Consumer Rights and Protection** - Know your consumer rights
4. **Women's Rights and Gender Equality** - Legal protections for women
5. **Labor Rights and Workers' Protection** - Workers' rights and labor laws
6. **Right to Information (RTI)** - Access government information

## 🔑 Test Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Regular User:**
- Username: `testuser`
- Password: `test123`

## 📖 API Documentation

Once the backend is running, visit: http://localhost:8000/docs for interactive API documentation.

## 🎨 Features in Detail

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Progress Tracking**: Monitor your learning progress across all modules
- **Quiz System**: Interactive quizzes with instant feedback
- **Secure Authentication**: JWT-based authentication system
- **Admin Panel**: Manage modules and content (admin only)

## 📝 Project Structure

```
sandy-project/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── auth.py          # Authentication logic
│   ├── database.py      # Database configuration
│   └── seed_data.py     # Database seeding script
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── components/  # Reusable components
│   │   └── context/      # Context providers
│   └── package.json
└── README.md
```

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📄 License

This project is for educational purposes.

## 🔗 Repository

[GitHub Repository](https://github.com/HARIHARANMURALIREC/Sandy-project.git)

---

**Built with ❤️ for legal literacy and education**

