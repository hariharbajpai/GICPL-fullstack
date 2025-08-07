// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function AdminLogin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         'https://gicpl-fullstack-backend.onrender.com/api/admin/login',
//         { email, password }
//       );
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         alert('Login successful!');
//         navigate('/admin/dashboard');
//       }
//     } catch (error) {
//       setError(error.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center px-4 py-12">
//       <form
//         onSubmit={handleLogin}
//         className="animate-fadeIn3D bg-white/80 backdrop-blur-lg border border-gray-200 p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform transition-transform duration-500 hover:scale-[1.02] max-w-md w-full"
//       >
//         <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 drop-shadow-lg">
//           Admin Login
//         </h2>

//         {error && (
//           <div className="mb-4 p-3 text-red-600 bg-red-100 border border-red-300 rounded-lg text-sm text-center shadow-sm">
//             {error}
//           </div>
//         )}

//         <div className="mb-5">
//           <label className="block text-gray-700 font-medium mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             placeholder="admin@example.com"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 font-medium mb-1">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             placeholder="••••••••"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }
