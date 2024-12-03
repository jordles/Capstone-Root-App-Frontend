import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import './Auth.css';

function LoginPage() {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserId, setUserHandle } = useContext(AuthContext);

  const grabLogin = async () => {
    try {
      const user = localStorage.getItem('userId')
      const response = await axios.get(`https://capstone-root-app-backend.onrender.com/api/users/${user}/login`);
      console.log('Login data:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching login:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Attempting login with:', { userEmail, password });
      const response = await axios.post('https://capstone-root-app-backend.onrender.com/api/users/login', {
        userEmail,
        password
      });

      console.log('Server response:', response.data);
      
      if (response.data) {
        // Store user data in localStorage
        localStorage.setItem('userId', response.data.user); // _id for the user database

        const login = await grabLogin();
        localStorage.setItem('loginId', login._id); // _id for the login database
        localStorage.setItem('userEmail', login.email); 

        // Get user data to update handle
        const userData = await axios.get(`https://capstone-root-app-backend.onrender.com/api/users/${response.data.user}`);
        
        // Update auth context
        setIsAuthenticated(true);
        setUserId(response.data.user);
        setUserHandle(userData.data.name.handle);

        console.log('Login successful');
        navigate('/feed');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username:</label>
          <input
            type="text"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
      </div>
      <div>
        <Link to="/register">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}

export default LoginPage;
