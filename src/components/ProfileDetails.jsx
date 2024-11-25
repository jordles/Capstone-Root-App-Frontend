import Display from './Display';
import Handle from './Handle';

const ProfileDetails = ({display, handle, style}) => {
  return (
    <div className="profile-details" style={style}>
      <Display display= {display} />
      <Handle handle={handle} />
    </div>
  )
};

export default ProfileDetails