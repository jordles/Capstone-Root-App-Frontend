import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SettingsPage.css';
import { AuthContext } from '../App';

function SettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { setUserHandle } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    handleName: '',
    username: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const user = await axios.get(`http://localhost:3000/api/users/${userId}`);
        const userData = user.data;
        console.log('User data:', userData);

        const login = await axios.get(`http://localhost:3000/api/users/${userId}/login`);
        const loginData = login.data;
        console.log('Login data:', loginData);

        setFormData({
          firstName: userData.name.first || '',
          lastName: userData.name.last || '',
          displayName: userData.name.display || '',
          handleName: userData.name.handle || '',
          username: loginData.username || '',
          email: userData.email || '',
          bio: userData.bio || '',
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/users/forgot-password', { 
        email: formData.email 
      });
      setMessage('Password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await axios.patch(`http://localhost:3000/api/users/settings/${userId}`, {
        name: {
          first: formData.firstName,
          last: formData.lastName,
          display: formData.displayName,
          handle: formData.handleName
        },
        email: formData.email,
        bio: formData.bio,
      });

      const login = await axios.get(`http://localhost:3000/api/users/${userId}/login`);
      const loginData = login.data;
      const response2 = await axios.patch(`http://localhost:3000/api/logins/${loginData._id}`, {
        username: formData.username,
        email: formData.email
      });

      // Update the global handle state
      setUserHandle(formData.handleName);
      
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || err.response2?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
      {error && <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Display Name:</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Handle:</label>
          <input
            type="text"
            name="handleName"
            value={formData.handleName}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Bio:</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>

      <div className="password-reset-section">
        <h3>Change Password</h3>
        <p>To change your password, click the button below to receive a password reset link in your email.</p>
        <button onClick={handlePasswordReset}>Send Password Reset Link</button>
      </div>
    </div>
  );
}

export default SettingsPage;
