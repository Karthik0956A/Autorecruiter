import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import JobDescription from './pages/JobDescription';
import UploadResume from './pages/UploadResume';
import MatchCandidates from './pages/MatchCandidates';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="job-description" element={<JobDescription />} />
        <Route path="upload-resume" element={<UploadResume />} />
        <Route path="match-candidates" element={<MatchCandidates />} />
      </Route>
    </Routes>
  );
}

export default App;
