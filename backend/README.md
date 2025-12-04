# TalentSense AI - Backend

## 🚀 Overview
Backend API for TalentSense AI - Intelligent Candidate Discovery & Matching Platform

## 📁 Project Structure
```
backend/
├── server.js                 # Main server file
├── .env                      # Environment variables
├── uploads/                  # Uploaded resume files
└── src/
    ├── config/
    │   └── database.js       # MongoDB connection
    ├── models/
    │   ├── User.js
    │   ├── JobDescription.js
    │   ├── Candidate.js
    │   └── Feedback.js
    ├── controllers/
    │   ├── authController.js
    │   ├── jdController.js
    │   ├── candidateController.js
    │   ├── matchController.js
    │   └── analyticsController.js
    ├── routes/
    │   ├── auth.js
    │   ├── jd.js
    │   ├── candidates.js
    │   ├── matching.js
    │   └── analytics.js
    ├── middleware/
    │   ├── auth.js            # JWT authentication
    │   ├── upload.js          # File upload handler
    │   └── error.js           # Error handler
    ├── services/
    │   ├── aiService.js       # AI/ML operations
    │   └── matchingService.js # Matching logic
    └── utils/
        ├── tokenUtils.js      # JWT utilities
        └── resumeParser.js    # Resume parsing
```

## 🔧 Tech Stack
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **pdf-parse** - PDF parsing
- **mammoth** - DOC/DOCX parsing

## 🚦 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally or Atlas)

### Installation
\`\`\`bash
cd backend
npm install
\`\`\`

### Environment Setup
Create `.env` file:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talentsense
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
\`\`\`

### Run Server
\`\`\`bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
\`\`\`

Server runs at: **http://localhost:5000**

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Job Descriptions
- `POST /api/jd/analyze` - Analyze JD text
- `POST /api/jd` - Create JD (Protected)
- `GET /api/jd` - List all JDs (Protected)
- `GET /api/jd/:id` - Get single JD (Protected)
- `PUT /api/jd/:id` - Update JD (Protected)
- `DELETE /api/jd/:id` - Delete JD (Protected)

### Candidates
- `POST /api/candidates/upload` - Upload candidates (Protected)
- `POST /api/candidates/parse-resume` - Parse resume file (Protected)
- `GET /api/candidates` - List candidates (Protected)
- `GET /api/candidates/:id` - Get candidate (Protected)
- `PUT /api/candidates/:id` - Update candidate (Protected)
- `DELETE /api/candidates/:id` - Delete candidate (Protected)

### Matching & Feedback
- `GET /api/match` - Get matched candidates (Protected)
- `POST /api/match/refresh` - Recalculate matches (Protected)
- `POST /api/match/explain` - Explain match (Protected)
- `POST /api/feedback` - Submit feedback (Protected)
- `GET /api/feedback` - Get feedback history (Protected)

### Analytics
- `GET /api/analytics/overview` - Dashboard stats (Protected)
- `GET /api/analytics/match-distribution` - Chart data (Protected)
- `GET /api/analytics/top-skills` - Top skills data (Protected)
- `GET /api/analytics/learning-insights` - AI insights (Protected)

### System
- `GET /api/health` - Health check
- `GET /` - API info

## 🔐 Authentication
All protected routes require JWT token in header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## 💾 Database Models

### User
- name, email, password, role
- Methods: comparePassword()

### JobDescription
- user, role, required_skills, good_to_have
- experience_level, summary, raw_text

### Candidate
- user, jd_id, name, email, phone
- skills, experience_years, match_score
- matched_skills, missing_skills, status
- feedback_weight (for learning)

### Feedback
- user, jd_id, candidate_id
- action (viewed/shortlisted/rejected/hired)
- notes, timestamp

## 🤖 AI Features

### JD Analysis
- Extracts role, skills, experience level
- Separates must-have vs good-to-have skills
- Generates summary

### Resume Parsing
- Parses PDF, DOC, DOCX files
- Extracts name, email, phone, skills
- Estimates experience years

### Matching Algorithm
- 70% weight on skill matching
- 20% weight on experience
- 10% weight on good-to-have skills
- Learning from feedback (weight adjustment)

### Feedback Learning
- **Viewed**: +2% weight boost
- **Shortlisted**: +15% weight boost
- **Rejected**: -10% weight penalty
- **Hired**: +40% weight boost

## 📊 Matching Score Calculation
\`\`\`
score = (matched_required_skills / total_required) * 70
      + (matched_good_to_have / total_good_to_have) * 10
      + experience_match * 20
      
final_score = score * feedback_weight
\`\`\`

## 🔄 API Flow

1. **Register/Login** → Get JWT token
2. **Analyze JD** → Extract requirements
3. **Create JD** → Save to database
4. **Upload Resumes** → Parse and extract data
5. **Auto-Match** → Calculate scores
6. **Submit Feedback** → Update weights
7. **View Analytics** → Dashboard insights

## 🧪 Testing API

### Using cURL
\`\`\`bash
# Register
curl -X POST http://localhost:5000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"john@example.com","password":"123456"}'

# Analyze JD
curl -X POST http://localhost:5000/api/jd/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"jd_text":"Looking for React developer with 3 years experience"}'
\`\`\`

### Using Postman
1. Import the API endpoints
2. Create environment with `BASE_URL` = http://localhost:5000
3. Add `Authorization` header with token after login

## 🐛 Error Handling
- Validation errors → 400
- Unauthorized → 401
- Not found → 404
- Server errors → 500

All errors return JSON:
\`\`\`json
{
  "success": false,
  "message": "Error description"
}
\`\`\`

## 📝 Notes
- Resume files stored in `uploads/` directory
- Parsed files are deleted after processing
- AI service uses mock implementation (integrate real AI API)
- MongoDB indexes for performance
- CORS enabled for frontend

## 🚀 Deployment

### Environment Variables
\`\`\`env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=strong_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

### Deploy to Heroku/Render
1. Push code to GitHub
2. Connect repository
3. Add environment variables
4. Deploy

## 📚 Future Enhancements
- Integrate real AI API (Gemma/OpenAI/Groq)
- Vector database for semantic search
- Email notifications
- Advanced analytics
- Real-time updates (Socket.io)
- Rate limiting
- API documentation (Swagger)

---

**Backend is ready for production! 🎉**
