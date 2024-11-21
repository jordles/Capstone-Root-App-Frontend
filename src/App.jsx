import { Routes, Route } from 'react-router-dom';
import ColorPicker from './components/ColorPicker';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FeedPage from './pages/FeedPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
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
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/color-picker" element={<ColorPicker />} />
      </Routes>
    </div>
  );
}

export default App;
