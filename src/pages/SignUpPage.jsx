import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Auth.css';

function SignUpPage(){
  const [nameFirst, setNameFirst] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [nameDisplay, setNameDisplay] = useState('');
  const [nameHandle, setNameHandle] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!nameFirst || !nameDisplay || !nameHandle || !email || !username || !password) {
      setError('Please fill in all required fields');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    try {
      const requestBody = {
        "name.first": nameFirst,
        "name.display": nameDisplay,
        "name.handle": nameHandle,
        email,
        username,
        password
      };

      // Only add last name if it's not empty
      if (nameLast.trim()) {
        requestBody["name.last"] = nameLast;
      }

      const response = await axios.post('http://localhost:3000/api/users/register', requestBody);
      
      console.log('Server response:', response.data);
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign up');
    }
  };

  return(
    <div className="auth-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label htmlFor="nameFirst">First Name:</label>
          <input 
            type="text" 
            placeholder="First Name" 
            id="nameFirst" 
            value={nameFirst} 
            onChange={(e) => setNameFirst(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="nameLast">Last Name:</label>
          <input 
            type="text" 
            placeholder="Last Name (optional)" 
            id="nameLast" 
            value={nameLast} 
            onChange={(e) => setNameLast(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nameDisplay">Display Name:</label>
          <input 
            type="text" 
            placeholder="Display Name" 
            id="nameDisplay" 
            value={nameDisplay} 
            onChange={(e) => setNameDisplay(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="nameHandle">Handle:</label>
          <input 
            type="text" 
            placeholder="Handle" 
            id="nameHandle" 
            value={nameHandle} 
            onChange={(e) => setNameHandle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            placeholder="Email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            id="username" 
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            id="password" 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            id="confirmPassword" 
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Sign Up</button>

      </form>
      {error && <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
    </div>
  );
}

export default SignUpPage;