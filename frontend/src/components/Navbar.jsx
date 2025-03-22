import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Navbar User State:', user); // Debugging

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold flex items-center space-x-2">
          <FaTrophy className="text-white" />
          <span>GICPL</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-gray-200">
            About
          </Link>
          <Link to="/teams" className="text-white hover:text-gray-200">
            Teams
          </Link>
          <Link to="/schedule" className="text-white hover:text-gray-200">
            Schedule
          </Link>
          <Link to="/gallery" className="text-white hover:text-gray-200">
            Gallery
          </Link>

          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="text-white hover:text-gray-200">
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-200 transition duration-300"
              >
                Logout ({user.name || user.email})
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-200 transition duration-300"
            >
              Login
            </Link>
          )}
        </div>

        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-indigo-600 p-8 rounded-lg w-11/12 max-w-md text-center">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-white hover:text-gray-200" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/about" className="text-white hover:text-gray-200" onClick={toggleMenu}>
                About
              </Link>
              <Link to="/teams" className="text-white hover:text-gray-200" onClick={toggleMenu}>
                Teams
              </Link>
              <Link to="/schedule" className="text-white hover:text-gray-200" onClick={toggleMenu}>
                Schedule
              </Link>
              <Link to="/gallery" className="text-white hover:text-gray-200" onClick={toggleMenu}>
                Gallery
              </Link>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin-dashboard" className="text-white hover:text-gray-200" onClick={toggleMenu}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-200 transition duration-300"
                  >
                    Logout ({user.name || user.email})
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 px-4 py-2 rounded hover:bg-gray-200 transition duration-300"
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