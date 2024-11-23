import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../Card';
import './FriendSuggestions.css';

function FriendSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        // Get current user from localStorage
        const user = localStorage.getItem('userId');
        console.log('Current user:', user);
        setCurrentUser(user);

        // Fetch users that the current user is not following
        const response = await axios.get(`http://localhost:3000/api/users/suggestions/${user}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    try {
      await axios.post(`http://localhost:3000/api/users/${currentUser}/follow`, {
        userToFollowId: userId
      });
      
      // Remove the followed user from suggestions
      setSuggestions(suggestions.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return <Card><div className="suggestions-card loading">Loading...</div></Card>;
  }

  return (
    <Card>
      <div className="suggestions-card">
        <h3>Who to Follow</h3>
        <ul>
          {suggestions.map((user) => (
            <li key={user._id}>
              <Link to={`/profile/${user.name.handle}`} className="user-info">
                <img 
                  src={user.profilePicture || "https://via.placeholder.com/40"} 
                  alt={user.name.display || 'User'} 
                />
                <div className="user-details">
                  <span className="user-name">{user.name.display || 'Anonymous'}</span>
                  <span className="user-handle">@{user.name.handle || 'anonymous'}</span>
                </div>
              </Link>
              <button 
                className="follow-button"
                onClick={() => handleFollow(user._id)}
              >
                <span className="material-symbols-rounded">person_add</span>
              </button>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li className="no-suggestions">No suggestions available</li>
          )}
        </ul>
      </div>
    </Card>
  );
}

export default FriendSuggestions;
