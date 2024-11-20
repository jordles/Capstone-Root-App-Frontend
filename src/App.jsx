import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ColorPicker from './components/ColorPicker';
import SessionsList from './components/SessionsList';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h1>Welcome to Root App</h1>
                <SessionsList />
                <ColorPicker />
                <div>
                  <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                  </a>
                  <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                  </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                  <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                  </p>
                </div>
                <p className="read-the-docs">
                  Click on the Vite and React logos to learn more
                </p>
              </div>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/color-picker" element={<ColorPicker />} />
          <Route path="/sessions" element={<SessionsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
