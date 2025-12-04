import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Recruiter');

  useEffect(() => {
    // Get user info from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'Recruiter');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/job-description', label: 'Job Description', icon: '📝' },
    { path: '/upload-resume', label: 'Upload Resume', icon: '📄' },
    { path: '/match-candidates', label: 'Match Candidates', icon: '🎯' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🚀</div>
              <h1 className="text-2xl font-bold text-gray-900">TalentSense AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userName}</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)] border-r border-gray-200">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
