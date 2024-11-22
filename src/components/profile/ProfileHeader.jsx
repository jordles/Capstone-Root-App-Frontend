import { useState } from 'react';
import './ProfileHeader.css';

const ProfileHeader = ({ profileData, isOwnProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      // TODO: Implement follow/unfollow API call
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };

  const handleMessage = () => {
    // TODO: Implement direct messaging functionality
    console.log('Message button clicked');
  };

  const handleEditProfile = () => {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  };

  return (
    <div className="profile-header">
      <div className="profile-cover">
        <img 
          src={profileData.coverImage || 'default-cover.jpg'} 
          alt="Profile cover"
          className="cover-image"
        />
      </div>
      
      <div className="profile-info">
        <div className="profile-avatar">
          <img 
            src={profileData.avatar || 'default-avatar.jpg'} 
            alt={profileData.name}
            className="avatar-image"
          />
        </div>
        
        <div className="profile-details">
          <h1 className="profile-name">{profileData.name}</h1>
          <p className="profile-handle">@{profileData.handle}</p>
          <p className="profile-bio">{profileData.bio}</p>
          
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-count">{profileData.posts?.length || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-count">{profileData.followers?.length || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat">
              <span className="stat-count">{profileData.following?.length || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isOwnProfile ? (
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              <span className="material-symbols-rounded">edit</span>
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                <span className="material-symbols-rounded">
                  {isFollowing ? 'person_remove' : 'person_add'}
                </span>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="message-btn" onClick={handleMessage}>
                <span className="material-symbols-rounded">mail</span>
                Message
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
