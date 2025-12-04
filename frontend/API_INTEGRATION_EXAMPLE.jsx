// Example: How to integrate API calls in Dashboard.jsx

import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
// ... other imports

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    avgMatchScore: 0,
    activeMatches: 0
  });
  const [matchDistribution, setMatchDistribution] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel
      const [overviewRes, distributionRes, skillsRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getMatchDistribution(),
        analyticsAPI.getTopSkills()
      ]);

      // Update state with real data
      setStats(overviewRes.data.data);
      setMatchDistribution(distributionRes.data.data);
      setTopSkills(skillsRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon="💼"
          color="blue"
        />
        <StatCard
          title="Total Candidates"
          value={stats.totalCandidates}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Avg Match Score"
          value={`${stats.avgMatchScore}%`}
          icon="⭐"
          color="purple"
        />
        <StatCard
          title="Active Matches"
          value={stats.activeMatches}
          icon="🎯"
          color="orange"
        />
      </div>

      {/* Charts with Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Match Distribution</h2>
          <Pie data={formatPieChartData(matchDistribution)} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Top Skills</h2>
          <Bar data={formatBarChartData(topSkills)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
