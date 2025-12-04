import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJDs: 5,
    totalCandidates: 45,
    totalShortlisted: 12,
    totalHired: 3,
    avgMatchScore: 72
  });

  const matchDistributionData = {
    labels: ['0-40%', '40-60%', '60-80%', '80-100%'],
    datasets: [
      {
        label: 'Candidates',
        data: [5, 12, 18, 10],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(59, 130, 246, 0.7)',
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(251, 191, 36)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topSkillsData = {
    labels: ['React', 'Node.js', 'Python', 'SQL', 'AWS'],
    datasets: [
      {
        label: 'Skill Count',
        data: [10, 7, 6, 5, 4],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const insights = [
    "Most shortlisted candidates for Frontend roles have 2-4 years of experience.",
    "React + Node.js appears in 70% of shortlisted full-stack roles.",
    "Candidates with AWS experience are 40% more likely to be hired."
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-2 text-gray-600">Overview of your recruitment pipeline</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total JDs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJDs}</p>
            </div>
            <div className="text-3xl">📝</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCandidates}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shortlisted</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalShortlisted}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hired</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalHired}</p>
            </div>
            <div className="text-3xl">🎉</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Match Score</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.avgMatchScore}%</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Score Distribution</h3>
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <Pie data={matchDistributionData} options={{ maintainAspectRatio: true }} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills (Shortlisted)</h3>
          <Bar 
            data={topSkillsData} 
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }} 
          />
        </div>
      </div>

      {/* AI Learning Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="text-3xl">🧠</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Learning Insights</h3>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
