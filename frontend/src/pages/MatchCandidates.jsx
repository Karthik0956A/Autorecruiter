import { useState, useEffect } from 'react';
import axios from 'axios';

const MatchCandidates = () => {
  const [selectedJD, setSelectedJD] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const mockJDs = [
    { id: 'jd-1', role: 'Frontend Developer' },
    { id: 'jd-2', role: 'Full Stack Developer' },
    { id: 'jd-3', role: 'Backend Developer' },
  ];

  const mockCandidates = [
    {
      candidate_id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      match_score: 87,
      matched_skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
      missing_skills: ['Redux'],
      summary: 'Experienced frontend developer with 3 years of React expertise',
      status: 'none',
      experience_years: 3
    },
    {
      candidate_id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      match_score: 92,
      matched_skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'CSS'],
      missing_skills: [],
      summary: 'Senior frontend developer with full-stack capabilities',
      status: 'shortlisted',
      experience_years: 5
    },
    {
      candidate_id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      match_score: 68,
      matched_skills: ['JavaScript', 'CSS'],
      missing_skills: ['React', 'TypeScript', 'Redux'],
      summary: 'Junior developer with foundational web development skills',
      status: 'none',
      experience_years: 1
    },
  ];

  useEffect(() => {
    if (selectedJD) {
      fetchCandidates();
    }
  }, [selectedJD]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await axios.get(`http://localhost:5000/api/match?jd_id=${selectedJD}`);
      // setCandidates(response.data.candidates);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setCandidates(mockCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (candidateId, action) => {
    try {
      await axios.post('http://localhost:5000/api/feedback', {
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

      alert(`Candidate ${action} successfully!`);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Mock update
      setCandidates(candidates.map(c => 
        c.candidate_id === candidateId 
          ? { ...c, status: action } 
          : c
      ));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusBadge = (status) => {
    const badges = {
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-blue-100 text-blue-800',
      viewed: 'bg-gray-100 text-gray-800',
      none: 'bg-gray-50 text-gray-600'
    };
    return badges[status] || badges.none;
  };

  const filteredCandidates = filterStatus === 'all' 
    ? candidates 
    : candidates.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Match Candidates</h2>
        <p className="mt-2 text-gray-600">View and manage candidate matches for job descriptions</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Job Description
            </label>
            <select
              value={selectedJD}
              onChange={(e) => setSelectedJD(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select a JD --</option>
              {mockJDs.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Candidates</option>
              <option value="none">Not Reviewed</option>
              <option value="viewed">Viewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      {!selectedJD ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-500">Select a job description to view matched candidates</p>
        </div>
      ) : loading ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Loading candidates...</p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">No candidates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.candidate_id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(candidate.match_score)}`}>
                      {candidate.match_score}% Match
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(candidate.status)}`}>
                      {candidate.status === 'none' ? 'New' : candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">📧 {candidate.email}</p>
                    <p className="text-sm text-gray-600">💼 {candidate.experience_years} years experience</p>
                    <p className="text-gray-700">{candidate.summary}</p>
                  </div>

                  {/* Matched Skills */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">✅ Matched Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  {candidate.missing_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">⚠️ Missing Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.missing_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleFeedback(candidate.candidate_id, 'viewed')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  👁️ View
                </button>
                <button
                  onClick={() => handleFeedback(candidate.candidate_id, 'shortlisted')}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  ⭐ Shortlist
                </button>
                <button
                  onClick={() => handleFeedback(candidate.candidate_id, 'rejected')}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => handleFeedback(candidate.candidate_id, 'hired')}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  🎉 Hire
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchCandidates;
