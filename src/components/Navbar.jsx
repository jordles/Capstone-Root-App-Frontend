import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import './Navbar.css';
import RootLogo from './RootLogo';
import { AuthContext } from '../App';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, userId, setUserId, userHandle, setUserHandle } = useContext(AuthContext);

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('loginId');
    localStorage.removeItem('userEmail');
    
    // Reset state
    setIsAuthenticated(false);
    setUserId(null);
    setUserHandle('');
    
    // Navigate to login page
    // navigate('/login');
  };

  if (isAuthenticated) {
    return (
      <nav className="navbar">
        <Link to="/feed">
          <RootLogo />
        </Link>
        <div className="nav-links">
          <Link to={`/profile/${userHandle}`}>Profile</Link>
          <Link to="/login" onClick={handleLogout}><button className="logout-button">Logout</button></Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <RootLogo />
      </Link>
      <div className="nav-links">
        <Link to="/register">Sign Up</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
