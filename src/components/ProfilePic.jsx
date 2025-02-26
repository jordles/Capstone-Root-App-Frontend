import React from 'react'
import './ProfilePic.css'

const ProfilePic = ({user}) => {
  return (
    <img className = "profilePic"
      src={user.profilePicture || "https://placehold.co/40"} 
      alt={user.name.display}
    />
  );
};

export default ProfilePic