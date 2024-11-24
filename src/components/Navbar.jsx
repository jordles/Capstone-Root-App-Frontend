import { Link } from 'react-router-dom';
import './Navbar.css';
import RootLogo from './RootLogo';
function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/feed">
        <RootLogo />
      </Link>
      <Link to="/">Home</Link>
      <Link to="/color-picker">Color Picker</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
