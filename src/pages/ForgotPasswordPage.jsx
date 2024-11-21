import { useState } from 'react';
import axios from 'axios';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/api/users/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      {message && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>{message}</div>}
      {error && <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
