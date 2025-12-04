import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import JobDescription from './pages/JobDescription';
import UploadResume from './pages/UploadResume';
import MatchCandidates from './pages/MatchCandidates';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="job-description" element={<JobDescription />} />
        <Route path="upload-resume" element={<UploadResume />} />
        <Route path="match-candidates" element={<MatchCandidates />} />
      </Route>
    </Routes>
  );
}

export default App;
