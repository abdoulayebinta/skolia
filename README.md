# IDÉLLIA - AI-Powered Learning Journey Platform

<div align="center">

![IDÉLLIA Logo](frontend/public/flame-icon.svg)

**Transform Passive Content into Active Learning**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**IDÉLLIA** is an AI-powered educational platform that helps educators create structured, curriculum-aligned learning journeys in under 2 minutes. Built on top of IDÉLLO's certified 15,000+ resource library, IDÉLLIA transforms passive educational content into active, engaging learning experiences.

### Key Highlights

- 🤖 **AI-Powered Generation**: Automatically creates 4-step learning journeys from simple text prompts
- 🔒 **Privacy-First**: Anonymous student access via class codes - no personal data collection
- 🌍 **Culturally Relevant**: Prioritizes diverse voices and indigenous content
- 📚 **Curriculum-Aligned**: Every resource is vetted and mapped to specific learning outcomes
- ⚡ **Fast & Intuitive**: Generate complete lesson plans in under 2 minutes

---

## ✨ Features

### For Educators

- **🎯 Journey Generation**: Enter a lesson prompt and get a structured 4-step learning journey
  - **Preparation**: Teacher resources (guides, sequences, thematic files)
  - **Hook**: Engaging student content (videos, games)
  - **Instruction**: Informative materials (articles, books, videos)
  - **Application**: Interactive activities (games, worksheets, podcasts)

- **🔄 Resource Swapping**: Easily swap resources to customize journeys
- **📊 Curriculum Alignment**: View alignment scores for each resource
- **🚀 One-Click Deployment**: Generate unique class codes to share with students
- **💾 Journey Management**: Save, edit, and reuse your learning journeys

### For Students

- **🎓 Anonymous Access**: Join classes using simple 6-character codes
- **📱 Interactive Player**: Step-by-step guided learning experience
- **🎮 Engaging Content**: Videos, games, articles, and interactive activities
- **✅ Progress Tracking**: Visual progress through learning steps

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.13)
- **Database**: MongoDB Atlas
- **Authentication**: JWT with Argon2 password hashing
- **Async Driver**: Motor (async MongoDB driver)
- **Validation**: Pydantic v2

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Infrastructure
- **API**: RESTful architecture
- **CORS**: Configured for secure cross-origin requests
- **Environment**: Development and production configurations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Educator   │  │   Student    │  │   Landing    │      │
│  │   Dashboard  │  │    Player    │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (FastAPI)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │   Journeys   │  │  Resources   │      │
│  │   Router     │  │    Router    │  │    Router    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Journey    │  │   Security   │  │     Auth     │      │
│  │  Generator   │  │   Utilities  │  │ Dependencies │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Motor (Async Driver)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  educators   │  │   journeys   │  │  resources   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.13+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **MongoDB Atlas Account** ([Sign Up](https://www.mongodb.com/cloud/atlas/register))
- **Git** ([Download](https://git-scm.com/downloads))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/snapdev-support/app-cf7a10f4.git
   cd app-cf7a10f4
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your MongoDB Atlas URI and JWT secret
   ```

3. **Set up the Frontend**
   ```bash
   cd ../frontend
   
   # Install dependencies
   npm install
   
   # Configure environment variables
   cp .env.local.example .env.local
   # Edit .env.local if needed (default: http://localhost:8000/api/v1)
   ```

4. **Seed the Database**
   ```bash
   cd ../backend
   python -m backend.scripts.seed_resources
   ```

### Running the Application

1. **Start the Backend** (Terminal 1)
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```
   Backend will be available at: http://localhost:8000
   API Documentation: http://localhost:8000/docs

2. **Start the Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will be available at: http://localhost:3000

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Sign Up
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "educator@school.ca",
  "password": "securepassword123",
  "name": "Jane Doe"
}
```

#### Log In
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "educator@school.ca",
  "password": "securepassword123"
}
```

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <jwt_token>
```

### Journey Endpoints

#### Generate Journey
```http
POST /api/v1/journeys/generate
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "prompt": "Grade 5 Science lesson about photosynthesis and plant life"
}
```

#### Create Journey
```http
POST /api/v1/journeys
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Photosynthesis Journey",
  "grade": 5,
  "subject": "Science",
  "steps": [...]
}
```

#### Get Journey by ID
```http
GET /api/v1/journeys/{journey_id}
Authorization: Bearer <jwt_token>
```

#### Update Journey
```http
PUT /api/v1/journeys/{journey_id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "steps": [...]
}
```

#### Deploy Journey
```http
POST /api/v1/journeys/{journey_id}/deploy
Authorization: Bearer <jwt_token>
```

#### Get Journey by Code (Public)
```http
GET /api/v1/journeys/code/{class_code}
```

### Resource Endpoints

#### List Resources
```http
GET /api/v1/resources?subject=Science&grade=5&type=video
```

#### Search Resources
```http
GET /api/v1/resources/search?q=photosynthesis&subject=Science
```

#### Get Resource by ID
```http
GET /api/v1/resources/{resource_id}
```

For complete API documentation, visit: http://localhost:8000/docs

---

## 📁 Project Structure

```
app-cf7a10f4/
├── backend/                    # FastAPI backend
│   ├── dependencies/          # Auth dependencies
│   │   └── auth.py           # JWT authentication
│   ├── models/               # Pydantic models
│   │   ├── educator.py       # Educator model
│   │   ├── journey.py        # Journey model
│   │   └── resource.py       # Resource model
│   ├── routers/              # API routes
│   │   ├── auth.py           # Authentication endpoints
│   │   ├── journeys.py       # Journey endpoints
│   │   └── resources.py      # Resource endpoints
│   ├── schemas/              # Request/Response schemas
│   │   ├── educator.py       # Auth schemas
│   │   ├── journey.py        # Journey schemas
│   │   └── resource.py       # Resource schemas
│   ├── scripts/              # Utility scripts
│   │   └── seed_resources.py # Database seeding
│   ├── services/             # Business logic
│   │   └── journey_generator.py # AI journey generation
│   ├── utils/                # Utilities
│   │   └── security.py       # Password hashing, JWT
│   ├── config.py             # Configuration management
│   ├── database.py           # MongoDB connection
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
│
├── frontend/                  # Next.js frontend
│   ├── app/                  # Next.js app directory
│   │   ├── educator/         # Educator pages
│   │   │   ├── page.tsx      # Journey builder
│   │   │   └── journey/[id]/ # Journey preview
│   │   ├── student/          # Student pages
│   │   │   ├── page.tsx      # Class code entry
│   │   │   └── journey/[code]/ # Journey player
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── ResourceCard.tsx  # Resource card
│   │   └── ResourceModal.tsx # Resource preview
│   ├── lib/                  # Utilities
│   │   ├── auth.ts           # Auth API client
│   │   ├── journeys.ts       # Journey API client
│   │   ├── resources.ts      # Resource API client
│   │   └── utils.ts          # Helper functions
│   └── package.json          # Node dependencies
│
├── .gitignore                # Git ignore rules
├── Backend-dev-plan.md       # Development plan
├── README.md                 # This file
└── SPRINT_*.md               # Sprint summaries
```

---

## 💻 Development

### Backend Development

#### Running Tests
```bash
cd backend
pytest
```

#### Code Formatting
```bash
black .
isort .
```

#### Type Checking
```bash
mypy .
```

### Frontend Development

#### Running Tests
```bash
cd frontend
npm test
```

#### Linting
```bash
npm run lint
```

#### Type Checking
```bash
npm run type-check
```

### Database Management

#### Seed Resources
```bash
cd backend
python -m backend.scripts.seed_resources
```

#### MongoDB Atlas Console
Access your database at: https://cloud.mongodb.com/

---

## 🚢 Deployment

### Backend Deployment

1. **Environment Variables**
   - Set `MONGODB_URI` to your production MongoDB Atlas connection string
   - Set `JWT_SECRET` to a secure random string (min 32 characters)
   - Set `CORS_ORIGINS` to your frontend domain
   - Set `APP_ENV=production`

2. **Deploy to Cloud Platform**
   - **Heroku**: Use `Procfile` with `web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Railway**: Connect GitHub repo and set environment variables
   - **AWS/GCP/Azure**: Use Docker or serverless deployment

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**
   - Set `NEXT_PUBLIC_API_URL` to your backend URL

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for all frontend code
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **IDÉLLO** for providing the certified resource library
- **FastAPI** for the excellent Python web framework
- **Next.js** for the powerful React framework
- **MongoDB** for the flexible database solution
- **shadcn/ui** for the beautiful UI components

---

## 📞 Support

For questions, issues, or feature requests:

- 📧 Email: support@idellia.ca
- 🐛 Issues: [GitHub Issues](https://github.com/snapdev-support/app-cf7a10f4/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/snapdev-support/app-cf7a10f4/discussions)

---

<div align="center">

**Made with ❤️ by the IDÉLLIA Team**

[Website](https://idellia.ca) • [Documentation](https://docs.idellia.ca) • [Blog](https://blog.idellia.ca)

</div>