import { Routes, Route } from 'react-router-dom';
import ColorPicker from './components/ColorPicker';
import SessionsList from './components/SessionsList';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
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
        <Route path="/color-picker" element={<ColorPicker />} />
        <Route path="/sessions" element={<SessionsList />} />
      </Routes>
    </div>
  );
}

export default App;
