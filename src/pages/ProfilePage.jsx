import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfilePosts from '../components/profile/ProfilePosts';
import './ProfilePage.css';

function ProfilePage() {
  const { handle } = useParams(); // Get the handle from the URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });

  const fetchProfileData = useCallback(async () => {
    const controller = new AbortController();

    try {
      const currentUserId = localStorage.getItem('userId');
      
      // Fetch user data first to get their ID
      const userResponse = await axios.get(`http://localhost:3000/api/users/profile/${handle}`);

      const userData = userResponse.data;

      // Then fetch posts using the profile owner's ID, not the current user's ID
      const postsResponse = await axios.get(`http://localhost:3000/api/posts/user/${userData._id}`);

      console.log('Posts:', postsResponse.data);
      if (!controller.signal.aborted) {
        setUser(userData);
        setIsOwnProfile(currentUserId === userData._id);
        setPosts(postsResponse.data);
        setStats({
          posts: userData.posts?.length || 0,
          followers: userData.followers?.length || 0,
          following: userData.following?.length || 0
        });
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error('Error fetching profile:', err);
        setError(err.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [handle]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleDeleteAccount = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:3000/api/logins/${user._id}`);
        localStorage.removeItem('userId');
        localStorage.removeItem('loginId');
        localStorage.removeItem('userEmail');
        navigate('/login');
      } catch (err) {
        console.error('Error deleting account:', err);
      }
    }
  }, [user?._id, navigate]);

  const handleMessage = useCallback(() => {
    if (window.startNewMessage && user) {
      window.startNewMessage({
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture
      });
    }
  }, [user]);

  const profileContent = useMemo(() => {
    if (loading) return <div className="profile-page loading">Loading...</div>;
    if (error) return <div className="profile-page error">Error: {error}</div>;
    if (!user) return <div className="profile-page not-found">User not found</div>;

    return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-cover">
            <img 
              src={user.coverPicture || "https://via.placeholder.com/1000x300"} 
              alt="Cover" 
              className="cover-image"
              loading="lazy"
            />
          </div>
          <div className="profile-info">
            <div className="profile-picture">
              <img 
                src={user.profilePicture || "https://via.placeholder.com/150"} 
                alt={user.name.display}
                loading="lazy"
              />
            </div>
            <div className="profile-details">
              <div className="profile-names">
              <h1>{user.name.display}</h1>
                <span className="handle">@{user.name.handle}</span>
              </div>
              <p className="bio">{user.bio || 'No bio available'}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="count">{stats.posts}</span>
                  <span className="label">Posts</span>
                </div>
                <div className="stat">
                  <span className="count">{stats.followers}</span>
                  <span className="label">Followers</span>
                </div>
                <div className="stat">
                  <span className="count">{stats.following}</span>
                  <span className="label">Following</span>
                </div>
              </div>

              <div className="profile-actions">
                {isOwnProfile ? (
                  <>
                    <Link to="/settings" className="edit-profile-btn">Edit Profile</Link>
                    <button onClick={handleDeleteAccount} className="delete-account-btn">
                      Delete Account
                    </button>
                  </>
                ) : (
                  <>
                    <button className="follow-btn">
                      Follow
                    </button>
                    <button className="message-btn" onClick={handleMessage}>
                      <span className="material-symbols-rounded">chat</span>
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <ProfilePosts posts={posts} />
        </div>
      </div>
    );
  }, [loading, error, user, stats, isOwnProfile, handleDeleteAccount, handleMessage, posts]);

  return profileContent;
}

export default ProfilePage;