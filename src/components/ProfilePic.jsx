import React from 'react'
import './ProfilePic.css'

const ProfilePic = ({user}) => {
  return (
    <img className = "profilePic"
      src={user.profilePicture || "https://via.placeholder.com/40"} 
      alt={user.name.display}
    />
  );
};

export default ProfilePic