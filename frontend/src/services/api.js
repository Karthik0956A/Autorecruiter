import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) => 
    api.post('/auth/register', { name, email, password }),
  
  getMe: () => 
    api.get('/auth/me'),
};

// Job Description API calls
export const jdAPI = {
  analyze: (jobDescription) => 
    api.post('/jd/analyze', { jobDescription }),
  
  create: (data) => 
    api.post('/jd', data),
  
  getAll: () => 
    api.get('/jd'),
  
  getById: (id) => 
    api.get(`/jd/${id}`),
  
  update: (id, data) => 
    api.put(`/jd/${id}`, data),
  
  delete: (id) => 
    api.delete(`/jd/${id}`),
};

// Candidate API calls
export const candidateAPI = {
  upload: (formData) => 
    api.post('/candidates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getAll: (params) => 
    api.get('/candidates', { params }),
  
  getById: (id) => 
    api.get(`/candidates/${id}`),
  
  update: (id, data) => 
    api.put(`/candidates/${id}`, data),
  
  delete: (id) => 
    api.delete(`/candidates/${id}`),
};

// Matching API calls
export const matchAPI = {
  getMatches: (jdId, params) => 
    api.get(`/match/${jdId}`, { params }),
  
  refreshMatches: (jdId) => 
    api.post(`/match/${jdId}/refresh`),
  
  explainMatch: (candidateId, jdId) => 
    api.get(`/match/explain/${candidateId}/${jdId}`),
  
  submitFeedback: (candidateId, jdId, action) => 
    api.post('/feedback', { candidateId, jdId, action }),
  
  getFeedback: (params) => 
    api.get('/feedback', { params }),
};

// Analytics API calls
export const analyticsAPI = {
  getOverview: () => 
    api.get('/analytics/overview'),
  
  getMatchDistribution: () => 
    api.get('/analytics/match-distribution'),
  
  getTopSkills: () => 
    api.get('/analytics/top-skills'),
  
  getLearningInsights: () => 
    api.get('/analytics/learning-insights'),
};

export default api;
