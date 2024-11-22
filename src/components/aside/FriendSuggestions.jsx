import './FriendSuggestions.css';

function FriendSuggestions() {
  const suggestions = [
    {
      id: 1,
      name: 'Plant Enthusiast',
      handle: '@plantenthusiast',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: 2,
      name: 'Garden Guru',
      handle: '@gardenguru',
      avatar: 'https://via.placeholder.com/40'
    },
    {
      id: 3,
      name: 'Green Thumb',
      handle: '@greenthumb',
      avatar: 'https://via.placeholder.com/40'
    }
  ];

  return (
    <div className="suggestions-card">
      <h3>Who to Follow</h3>
      <ul>
        {suggestions.map((user) => (
          <li key={user.id}>
            <div className="user-info">
              <img src={user.avatar} alt={user.name} />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-handle">{user.handle}</span>
              </div>
            </div>
            <button className="follow-button">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendSuggestions;
