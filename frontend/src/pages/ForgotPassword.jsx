import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement forgot password API endpoint
      // const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-white to-blue-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 text-white rounded-full p-4 text-4xl">
              🔐
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {!success ? (
            <>
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    className={`w-full px-4 py-3 border ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                    } rounded-lg focus:ring-2 focus:outline-none transition-colors`}
                    placeholder="you@example.com"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg text-white font-medium ${
                    loading
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success Message */
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        {!success && (
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
