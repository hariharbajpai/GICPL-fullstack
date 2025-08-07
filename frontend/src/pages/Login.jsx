import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

axios.defaults.baseURL = 'https://gicpl-fullstack-backend.onrender.com';

export default function AdminAuth() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? '/api/admin/signup' : '/api/admin/login';
      const requestData = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, requestData);

      if (response.data.success) {
        if (isSignup) {
          alert('Admin registered successfully! Please login.');
          setIsSignup(false);
        } else {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          login(response.data.user);
          alert('Login successful!');
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="animate-fadeIn3D bg-white/80 backdrop-blur-md border border-gray-200 p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform transition-transform hover:scale-[1.02] max-w-md w-full"
      >
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 drop-shadow-lg">
          {isSignup ? 'Admin Signup' : 'Admin Login'}
        </h2>

        {error && (
          <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded-lg text-sm text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Name */}
        {isSignup && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>
        )}

        {/* Phone Number */}
        {isSignup && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Login'}
        </button>

        {/* Toggle */}
        <p className="text-center mt-4 text-sm text-gray-600">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>

        {!isSignup && (
          <p className="text-center mt-2 text-sm">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
