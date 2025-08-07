import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 shadow-2xl z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-extrabold flex items-center space-x-2 hover:scale-105 transition-transform">
          <FaTrophy className="text-yellow-400" />
          <span className="tracking-wider drop-shadow">GICPL</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 text-lg font-medium">
          {['Home', 'About', 'Teams', 'Schedule', 'Gallery'].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="text-white hover:text-yellow-300 transition duration-200 hover:scale-105"
            >
              {item}
            </Link>
          ))}

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="text-white hover:text-yellow-300 hover:scale-105 transition">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-700 px-4 py-2 rounded-full shadow-md hover:bg-indigo-100 transition duration-300"
              >
                Logout ({user.name || user.email})
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-indigo-700 px-4 py-2 rounded-full shadow-md hover:bg-indigo-100 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl w-11/12 max-w-md shadow-2xl text-center transform scale-100 transition-all">
            <div className="flex flex-col space-y-6 text-xl text-white font-semibold">
              {['Home', 'About', 'Teams', 'Schedule', 'Gallery'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="hover:text-yellow-300 transition"
                  onClick={toggleMenu}
                >
                  {item}
                </Link>
              ))}

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin-dashboard"
                      className="hover:text-yellow-300 transition"
                      onClick={toggleMenu}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="bg-white text-indigo-700 px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition duration-300"
                  >
                    Logout ({user.name || user.email})
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-indigo-700 px-4 py-2 rounded-full shadow hover:bg-indigo-100 transition duration-300"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
