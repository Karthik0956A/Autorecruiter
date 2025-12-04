# API Integration Guide

## Base URL Configuration
Create an `.env` file in the frontend root:

\`\`\`env
VITE_API_BASE_URL=http://localhost:5000
\`\`\`

## Create API Service (Optional)
Create `src/services/api.js`:

\`\`\`javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
\`\`\`

## API Endpoints Usage

### 1. Job Description Page

\`\`\`javascript
// In JobDescription.jsx, replace mock implementation:

import api from '../services/api';

const handleAnalyze = async () => {
  try {
    const response = await api.post('/api/jd/analyze', {
      jd_text: jdText
    });
    setAnalysis(response.data);
  } catch (err) {
    setError('Failed to analyze job description');
  }
};

const handleSave = async () => {
  try {
    await api.post('/api/jd', analysis);
    alert('Job description saved successfully!');
  } catch (err) {
    setError('Failed to save job description');
  }
};
\`\`\`

### 2. Upload Resume Page

\`\`\`javascript
// In UploadResume.jsx:

import api from '../services/api';

const handleUpload = async () => {
  const formData = new FormData();
  
  resumes.forEach(resume => {
    formData.append('files', resume.file);
  });
  formData.append('jd_id', selectedJD);

  try {
    const response = await api.post('/api/candidates/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    setUploadStatus({
      success: true,
      message: \`Successfully uploaded \${response.data.saved_count} resume(s)\`
    });
  } catch (error) {
    setUploadStatus({
      success: false,
      message: 'Failed to upload resumes'
    });
  }
};
\`\`\`

### 3. Match Candidates Page

\`\`\`javascript
// In MatchCandidates.jsx:

import api from '../services/api';

const fetchCandidates = async () => {
  try {
    const response = await api.get(\`/api/match?jd_id=\${selectedJD}\`);
    setCandidates(response.data.candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
};

const handleFeedback = async (candidateId, action) => {
  try {
    await api.post('/api/feedback', {
      jd_id: selectedJD,
      candidate_id: candidateId,
      action: action
    });
    
    // Update local state
    setCandidates(candidates.map(c => 
      c.candidate_id === candidateId 
        ? { ...c, status: action } 
        : c
    ));
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
};
\`\`\`

### 4. Dashboard Page

\`\`\`javascript
// In Dashboard.jsx:

import api from '../services/api';
import { useEffect } from 'react';

useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {
    const [overview, distribution, topSkills, insights] = await Promise.all([
      api.get('/api/analytics/overview'),
      api.get('/api/analytics/match-distribution'),
      api.get('/api/analytics/top-skills?filter=shortlisted'),
      api.get('/api/analytics/learning-insights')
    ]);

    setStats(overview.data);
    setMatchDistributionData({
      labels: distribution.data.buckets.map(b => b.range),
      datasets: [{
        data: distribution.data.buckets.map(b => b.count),
        // ... styling
      }]
    });
    // ... update other chart data
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
\`\`\`

## Authentication Integration

### Login/Register
\`\`\`javascript
// Create src/services/auth.js

import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};
\`\`\`

### Update Layout Component
\`\`\`javascript
// In Layout.jsx:

import { logout } from '../services/auth';

<button 
  onClick={logout}
  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
>
  Logout
</button>
\`\`\`

## Error Handling Best Practices

\`\`\`javascript
// Global error handler in api.js

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
\`\`\`

## Loading States

Add loading indicators to all API calls:

\`\`\`javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
\`\`\`

## CORS Configuration

Make sure your backend allows requests from the frontend:

\`\`\`javascript
// Backend (Express.js example)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
\`\`\`

## Testing API Integration

1. Start backend server: `npm run dev` (in backend folder)
2. Start frontend server: `npm run dev` (in frontend folder)
3. Test each page functionality
4. Check browser console for errors
5. Use browser DevTools Network tab to inspect API calls

## Production Build

Update `.env.production`:
\`\`\`env
VITE_API_BASE_URL=https://your-api-domain.com
\`\`\`

Build:
\`\`\`bash
npm run build
\`\`\`

The build output will be in the `dist/` folder.
