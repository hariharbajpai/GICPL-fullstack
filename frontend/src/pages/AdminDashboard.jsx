import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user, logout } = useAuth(); // Get user and logout function from AuthContext
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    logout(); // Call logout function to clear user session
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Welcome Message */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <p className="text-2xl text-gray-700">
          Welcome back, <span className="font-bold text-blue-600">{user?.email}</span>!
        </p>
        <p className="text-gray-500 mt-2">You have full access to manage the GICPL website.</p>
      </div>

      <h2 className="text-red-500">NOTE: The data is incorrect since it's in trial mode</h2>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">1,234</p>
          <p className="text-gray-500">Active users on the platform</p>
        </div>

        {/* Total Teams */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-800">Total Teams</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">56</p>
          <p className="text-gray-500">Teams registered in GICPL</p>
        </div>

        {/* Total Matches */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-800">Total Matches</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">89</p>
          <p className="text-gray-500">Matches played so far</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {/* Activity Item 1 */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-4"></div>
            <div>
              <p className="text-gray-800">New user registered: Ayush</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>

          {/* Activity Item 2 */}
          <div className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-4"></div>
            <div>
              <p className="text-gray-800">Team "Trailblazers" won the match</p>
              <p className="text-sm text-gray-500">5 hours ago</p>
            </div>
          </div>

          {/* Activity Item 3 */}
          <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-4"></div>
            <div>
              <p className="text-gray-800">New match scheduled: Team A vs Team B</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}