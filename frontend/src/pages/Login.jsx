import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setServerError(''); // Clear server error on input change

    // Clear field error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }

    // Real-time email validation
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors({ ...errors, email: 'Please enter a valid email address' });
      } else {
        setErrors({ ...errors, email: '' });
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // API call to backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Success - 200 OK
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect to dashboard
        navigate('/');
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          setServerError('Invalid credentials. Please check your email and password.');
        } else if (error.response.status === 500) {
          setServerError('Server error. Please try again later.');
        } else {
          setServerError(error.response.data.message || 'An error occurred. Please try again.');
        }
      } else if (error.request) {
        // Request made but no response
        setServerError('Unable to connect to server. Please check your connection.');
      } else {
        // Something else happened
        setServerError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-12">
  <div className="max-w-md w-full space-y-10 fade-in">

    {/* Header */}
    <div className="text-center">
      <div className="flex justify-center mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg rounded-full p-5 text-5xl animate-bounce-slow">
          🚀
        </div>
      </div>
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
        Welcome Back
      </h2>
      <p className="mt-2 text-gray-600 text-lg">
        Sign in to <span className="font-semibold text-blue-700">TalentSense AI</span>
      </p>
    </div>

    {/* Login Form */}
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl p-10 rounded-3xl border border-gray-200 space-y-6 card-hover">

      {/* Server Error */}
      {serverError && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl flex items-start shadow-sm">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0..." />
          </svg>
          <span className="text-sm">{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Email Address</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border shadow-sm input-focus ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 10a8..." />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border shadow-sm input-focus ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor">
                <path d="M18 10a8..." />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center px-4 py-3 rounded-xl text-white font-semibold shadow-lg ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-[1.02] hover:shadow-xl"
          } transition-all`}
        >
          {loading ? (
            <>
              <svg className="animate-spin mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"></circle>
                <path className="opacity-75" d="M4 12a8..." />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor">
                <path d="M14 5l7 7..." />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white/80 text-gray-600">
            New to TalentSense?
          </span>
        </div>
      </div>

      {/* Create Account */}
      <button
        type="button"
        onClick={() => navigate("/register")}
        className="w-full flex justify-center items-center px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all"
      >
        Create an account
        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor">
          <path d="M18 9v3..." />
        </svg>
      </button>
    </div>

    {/* Footer */}
    <p className="text-center text-sm text-gray-600">
      By signing in, you agree to our{" "}
      <a className="text-blue-600 hover:text-blue-500">Terms</a> and{" "}
      <a className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
    </p>
  </div>
</div>

  );
};

export default Login;
