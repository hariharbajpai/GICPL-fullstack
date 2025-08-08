import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'https://gicpl-fullstack-backend.onrender.com/api/admin/reset-password',
        { email, phone, newPassword }
      );

      if (response.data.success) {
        setMessage('✅ Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/admin-auth'), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || '❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="animate-fadeIn3D bg-white/80 backdrop-blur-md border border-gray-200 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform transition-transform hover:scale-[1.02] max-w-md w-full"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 drop-shadow-lg">
          Reset Password
        </h2>

        {message && (
          <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg text-sm text-center shadow-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded-lg text-sm text-center shadow-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Registered Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="1234567890"
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="••••••••"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
        >
          Reset Password
        </button>

        {/* Back to Login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => navigate('/admin-auth')}
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
