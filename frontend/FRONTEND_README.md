# TalentSense AI - Frontend Documentation

## 🚀 Overview
TalentSense AI is an Intelligent Candidate Discovery & Matching Platform that helps recruiters efficiently match candidates with job descriptions using AI-powered analysis.

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with navigation
│   ├── pages/
│   │   ├── Dashboard.jsx        # Analytics dashboard with charts
│   │   ├── JobDescription.jsx   # JD analysis page
│   │   ├── UploadResume.jsx     # Resume upload interface
│   │   └── MatchCandidates.jsx  # Candidate matching & feedback
│   ├── App.jsx                  # Route configuration
│   ├── main.jsx                 # App entry point with Router
│   └── index.css                # Global styles with Tailwind
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## ✨ Features Implemented

### 1. **Dashboard** (`/`)
- Real-time statistics (JDs, Candidates, Shortlisted, Hired)
- Match score distribution pie chart
- Top skills bar chart
- AI learning insights panel

### 2. **Job Description Analyzer** (`/job-description`)
- Paste/upload job description
- AI extracts:
  - Role title
  - Experience level
  - Required skills (must-have)
  - Good-to-have skills
  - AI-generated summary
- Save analyzed JDs

### 3. **Upload Resume** (`/upload-resume`)
- Select job description
- Multi-file resume upload (PDF, DOC, DOCX)
- Drag & drop interface
- Upload progress tracking
- File management (add/remove)

### 4. **Match Candidates** (`/match-candidates`)
- View ranked candidates by match score
- Filter by status (all, shortlisted, rejected, hired)
- Match score visualization (color-coded)
- Skills comparison (matched vs missing)
- Feedback actions:
  - 👁️ View
  - ⭐ Shortlist
  - ❌ Reject
  - 🎉 Hire

## 🔧 Tech Stack
- **React 19** - UI framework
- **React Router DOM v7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js + react-chartjs-2** - Data visualization
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool

## 🚦 Getting Started

### Installation
\`\`\`bash
npm install
\`\`\`

### Development Server
\`\`\`bash
npm run dev
\`\`\`
Server runs at: http://localhost:5173/

### Build for Production
\`\`\`bash
npm run build
\`\`\`

## 🔗 API Integration Points

All pages are ready for backend integration. Mock data is used for demonstration. Replace with actual API calls:

### Endpoints to Connect:
1. `POST /api/jd/analyze` - Analyze job description
2. `POST /api/jd` - Save job description
3. `POST /api/candidates/upload` - Upload resumes
4. `GET /api/match?jd_id=...` - Get matched candidates
5. `POST /api/feedback` - Record recruiter actions
6. `GET /api/analytics/overview` - Dashboard statistics
7. `GET /api/analytics/match-distribution` - Chart data
8. `GET /api/analytics/top-skills` - Top skills data

## 🎨 UI Components

### Layout
- Responsive sidebar navigation
- Header with branding and user info
- Consistent page structure

### Color Coding
- **Green** - High match (80%+) / Matched skills
- **Blue** - Good match (60-80%) / Hired
- **Yellow** - Moderate match (40-60%)
- **Red** - Low match (<40%) / Missing skills / Rejected
- **Purple** - AI insights / Summaries

## 📊 Data Flow

1. **JD Analysis** → Extract requirements → Store in database
2. **Resume Upload** → Parse files → Extract candidate info
3. **Matching** → Compare JD vs Resumes → Calculate scores
4. **Feedback** → Track actions → Improve AI recommendations
5. **Analytics** → Aggregate data → Display insights

## 🔒 Authentication Ready
Header includes logout button. Connect to your auth provider (Firebase, Supabase, etc.)

## 📝 Mock Data Structure

### Job Description
\`\`\`javascript
{
  jd_id: "string",
  role: "Frontend Developer",
  required_skills: ["React", "JavaScript"],
  good_to_have: ["TypeScript"],
  experience_level: "2-4 years",
  summary: "AI summary..."
}
\`\`\`

### Candidate
\`\`\`javascript
{
  candidate_id: "string",
  name: "John Doe",
  email: "john@example.com",
  match_score: 87,
  matched_skills: ["React", "JavaScript"],
  missing_skills: ["Redux"],
  summary: "AI summary...",
  status: "none|viewed|shortlisted|rejected|hired",
  experience_years: 3
}
\`\`\`

## 🎯 Next Steps

1. **Connect Backend APIs** - Replace mock data with real endpoints
2. **Add Authentication** - Implement user login/logout
3. **File Upload** - Integrate actual file upload with FormData
4. **Real-time Updates** - Add WebSocket for live notifications
5. **Advanced Filtering** - Add search, sorting, pagination
6. **Export Features** - Download reports, candidate lists
7. **Mobile Responsiveness** - Optimize for mobile devices

## 🐛 Known Issues
- Mock data used for demonstration
- API endpoints need backend connection
- File parsing happens on backend (not yet connected)

## 📚 Additional Resources
- [React Router Docs](https://reactrouter.com/)
- [Chart.js Docs](https://www.chartjs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Axios Docs](https://axios-http.com/)

---

**Ready for Demo! 🎉**
All pages are functional with mock data. Connect backend APIs to make it fully operational.
