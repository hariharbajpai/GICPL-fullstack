import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

axios.defaults.baseURL = 'https://gicpl-fullstack-backend.onrender.com'; // Set base URL

export default function AdminAuth() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login & Signup
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login & Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isSignup ? '/api/admin/signup' : '/api/admin/login';
      const requestData = isSignup
        ? formData // All fields for signup
        : { email: formData.email, password: formData.password }; // Only email & password for login

      const response = await axios.post(endpoint, requestData);

      console.log("Login Response Data:", response.data); // Debugging

      if (response.data.success) {
        if (isSignup) {
          alert('Admin registered successfully! Please login.');
          setIsSignup(false); // Switch to login after signup
        } else {
          // Save token and user data to localStorage
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          // Update AuthContext with user data
          login(response.data.user);

          console.log("User Data after Login:", response.data.user); // Debugging

          alert('Login successful!');
          navigate('/admin/dashboard'); // Redirect to dashboard
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignup ? 'Admin Signup' : 'Admin Login'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Name (Only for Signup) */}
        {isSignup && (
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        )}

        {/* Phone Number (Only for Signup) */}
        {isSignup && (
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>

        {/* Toggle Signup/Login */}
        <p className="text-center mt-4">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 hover:text-blue-600"
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>

        {/* Forgot Password Link (Only for Login) */}
        {!isSignup && (
          <p className="text-center mt-2">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}
