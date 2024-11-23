import { Routes, Route, useLocation } from 'react-router-dom';
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

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/forgot-password', '/reset-password'].some(
    path => location.pathname.startsWith(path)
  );

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to Root App</h1>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile/:handle" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
      {!isAuthPage && <MessageWidget />}
    </div>
  );
}

export default App;
