import './ProfileCard.css';

function ProfileCard() {
  return (
    <div className="profile-card">
      <div className="profile-background"></div>
      <div className="profile-info">
        <img 
          src="https://via.placeholder.com/150"
          alt="Profile" 
          className="profile-pic" 
        />
        <h3>Plant Enthusiast</h3>
        <p>Sharing my love for plants!</p>
      </div>
    </div>
  );
}

export default ProfileCard;
