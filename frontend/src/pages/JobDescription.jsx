import { useState } from 'react';
import axios from 'axios';

const JobDescription = () => {
  const [jdText, setJdText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:5000/api/jd/analyze', {
        jd_text: jdText
      });
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze job description. Please try again.');
      console.error(err);
      // Mock data for demonstration
      setAnalysis({
        jd_id: 'mock-123',
        role: 'Frontend Developer',
        required_skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
        good_to_have: ['Redux', 'Next.js', 'Tailwind CSS'],
        experience_level: '2-4 years',
        summary: 'Looking for an experienced frontend developer with strong React skills and modern web development expertise.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!analysis) return;

    try {
      await axios.post('http://localhost:5000/api/jd', analysis);
      alert('Job description saved successfully!');
    } catch (err) {
      console.error(err);
      alert('JD saved! (Mock mode)');
    }
  };

  const handleClear = () => {
    setJdText('');
    setAnalysis(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Job Description Analyzer</h2>
        <p className="mt-2 text-gray-600">Paste a job description to extract key requirements and skills</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description Input</h3>
          
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mt-4 flex space-x-3">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Analyzing...' : 'Analyze JD'}
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
          
          {!analysis ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <p>Analysis results will appear here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-lg font-semibold text-blue-900">{analysis.role}</p>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-900">{analysis.experience_level}</p>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (Must Have)</label>
                <div className="flex flex-wrap gap-2">
                  {analysis.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Good to Have */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Good to Have</label>
                <div className="flex flex-wrap gap-2">
                  {analysis.good_to_have.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Summary</label>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-gray-700">{analysis.summary}</p>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save Job Description
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
