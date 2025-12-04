import { useState } from 'react';
import axios from 'axios';

const UploadResume = () => {
  const [selectedJD, setSelectedJD] = useState('');
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const mockJDs = [
    { id: 'jd-1', role: 'Frontend Developer' },
    { id: 'jd-2', role: 'Full Stack Developer' },
    { id: 'jd-3', role: 'Backend Developer' },
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newResumes = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      status: 'pending'
    }));
    setResumes([...resumes, ...newResumes]);
  };

  const handleRemoveResume = (index) => {
    setResumes(resumes.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedJD) {
      alert('Please select a job description');
      return;
    }

    if (resumes.length === 0) {
      alert('Please upload at least one resume');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Mock upload process
      for (let i = 0; i < resumes.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setResumes(prev => prev.map((r, idx) => 
          idx === i ? { ...r, status: 'uploaded' } : r
        ));
      }

      setUploadStatus({
        success: true,
        message: `Successfully uploaded ${resumes.length} resume(s) for ${mockJDs.find(jd => jd.id === selectedJD)?.role}`
      });

      // In real implementation:
      // const formData = new FormData();
      // resumes.forEach(resume => formData.append('files', resume.file));
      // formData.append('jd_id', selectedJD);
      // await axios.post('http://localhost:5000/api/candidates/upload', formData);

    } catch (error) {
      setUploadStatus({
        success: false,
        message: 'Failed to upload resumes. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setResumes([]);
    setUploadStatus(null);
    setSelectedJD('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Upload Resumes</h2>
        <p className="mt-2 text-gray-600">Upload candidate resumes to match with job descriptions</p>
      </div>

      {/* Job Description Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Files</h3>
        
        {/* Drop Zone */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            id="resume-upload"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg text-gray-700 mb-2">
              Drag and drop files here or <span className="text-blue-600 font-semibold">browse</span>
            </p>
            <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX (Max 10MB per file)</p>
          </label>
        </div>

        {/* Uploaded Files List */}
        {resumes.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Uploaded Files ({resumes.length})</h4>
            {resumes.map((resume, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {resume.status === 'uploaded' ? '✅' : '📄'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{resume.name}</p>
                    <p className="text-sm text-gray-500">{resume.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveResume(index)}
                  disabled={uploading}
                  className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus && (
          <div className={`mt-4 p-4 rounded-lg ${
            uploadStatus.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              uploadStatus.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {uploadStatus.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button
            onClick={handleUpload}
            disabled={uploading || resumes.length === 0 || !selectedJD}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {uploading ? 'Uploading...' : `Upload ${resumes.length} Resume(s)`}
          </button>
          <button
            onClick={handleClear}
            disabled={uploading}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-400 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">📌 Instructions</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Select a job description first</li>
          <li>• Upload multiple resumes at once (PDF, DOC, DOCX)</li>
          <li>• AI will automatically parse and extract candidate information</li>
          <li>• View matched candidates in the "Match Candidates" page</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadResume;
