import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import ColorPicker from './components/ColorPicker';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import Navbar from './components/Navbar';
import MessageWidget from './components/MessageWidget';
import './App.css';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userHandle, setUserHandle] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        try {
          const user = await axios.get(`https://capstone-root-app-backend.onrender.com/api/users/${storedUserId}`);
          setIsAuthenticated(true);
          setUserId(storedUserId);
          setUserHandle(user.data.name.handle);
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
    };

    fetchUserData();
  }, []);

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/'].some(
    path => location.pathname.startsWith(path)
  );

  const shouldShowMessageWidget = isAuthenticated && (
    location.pathname.startsWith('/feed') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/settings')
  );

  const authValue = {
    isAuthenticated,
    setIsAuthenticated,
    userId,
    setUserId,
    userHandle,
    setUserHandle
  };

  return (
    <AuthContext.Provider value={authValue}>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={ <HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignUpPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/profile/:handle" element={<ProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/color-picker" element={<ColorPicker />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        {shouldShowMessageWidget && <MessageWidget />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
