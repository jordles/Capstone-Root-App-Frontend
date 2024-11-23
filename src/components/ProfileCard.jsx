import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';
import './ProfileCard.css';

function ProfileCard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = localStorage.getItem('userId');
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        const response = await axios.get(`http://localhost:3000/api/users/${currentUser}`);

        console.log('Raw response:', response);
        
        if (response.status !== 200) {
          throw new Error(`Server returned status ${response.status}`);
        }

        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Card><div>Loading...</div></Card>;
  if (error) return <Card><div>Error: {error}</div></Card>;
  if (!user) return <Card><div>No user data available</div></Card>;

  return (
    <Card>
      <div className="profile-card">
        <Link to={`/profile/${user.name.handle}`} className="profile-link">
          <div className="profile-content">
            <div className="profile-background"></div>
            <div className="profile-info">
              <img 
                src={user.profilePicture || "https://via.placeholder.com/150"}
                alt={user.name.display || 'Profile'} 
                className="profile-pic" 
              />
              <h3>{user.name.display || 'Anonymous'}</h3>
              <span>@{user.name.handle || '@anonymous'}</span>
              <p>{user.bio || 'No bio available'}</p>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
}

export default ProfileCard;
