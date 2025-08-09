// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Teams from './pages/Teams';
import Schedule from './pages/Schedule';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminView from './pages/AdminView';
import PlayerProfile from './pages/PlayerProfile'; // ✅ NEW
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* ✅ Public Player Profiles page (admin features are inside component) */}
          <Route path="/players" element={<PlayerProfile />} />

          {/* Admin-only */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-view"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminView />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
