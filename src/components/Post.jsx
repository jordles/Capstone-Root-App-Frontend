import { useState, useEffect, memo, useCallback, useRef } from 'react';
import axios from 'axios';
import './Post.css';
import PostButton from './PostButton';
import OptionsPicker from './OptionsPicker';
import EditPost from './EditPost';

// Move format functions outside component to prevent recreation
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatTime = (dateString) => {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Date(dateString).toLocaleTimeString('en-US', options);
};

function Post({ post, onPostUpdated }) {
  const [userDetails, setUserDetails] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      try {
        // First get the post details
        const postResponse = await axios.get(`http://localhost:3000/api/posts/id/${post._id}`);
        const postWithUser = postResponse.data;
        
        // Then fetch the user details using the user ID from the post
        const userResponse = await axios.get(`http://localhost:3000/api/users/${postWithUser.user}`);
        
        if (isMounted) {
          setUserDetails(userResponse.data);
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    fetchUserDetails();
    return () => { isMounted = false; };
  }, [post._id]);

  useEffect(() => {
    let isMounted = true;

    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      isMounted = false;
    };
  }, []);

  const handleLike = useCallback(async () => {
    try {
      await axios.post(`http://localhost:3000/api/posts/${post._id}/like`);
      onPostUpdated(); // Notify parent to refresh posts
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [post._id, onPostUpdated]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/posts/${post._id}`);
      if (response.status === 200) {
        onPostUpdated(null); // null indicates post was deleted
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
    setShowOptions(false);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src="https://via.placeholder.com/50" alt="Author" />
        <div className="post-author">
          <h4>{userDetails ? userDetails.name.display : 'loading...'}</h4>
          <span>@{userDetails ? userDetails.name.handle : 'loading...'}</span>
        </div>
        <div className="post-timestamp">
          <span className="post-date">{formatDate(post.createdAt)}</span>
          <span className="post-time">{formatTime(post.createdAt)}</span>
        </div>
        <div className="options-picker-container" ref={optionsRef}>
          <PostButton
            icon="more_vert"
            label="options"
            className="highlight-button"
            onClick={() => setShowOptions(!showOptions)}
          />
          {showOptions && (
            <div className="options-picker-popup">
              <OptionsPicker 
                onEdit={() => {
                  setShowEditModal(true);
                  setShowOptions(false);
                }}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>
        
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="post-media">
            {post.mediaUrls.map((url, index) => (
              <div key={index} className="media-container">
                {url.startsWith('data:image') || url.endsWith('.gif') ? (
                  <img src={url} alt={`Post media ${index + 1}`} />
                ) : url.startsWith('data:video') ? (
                  <video src={url} controls />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="post-actions">
        <button onClick={handleLike}>
            🤍 {post.likes?.length || 0}
        </button>
        <button>💬 Comment</button>
        <button>🔄 Share</button>
      </div>
      
      {showEditModal && (
        <EditPost
          post={post}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={onPostUpdated}
        />
      )}
    </div>
  );
}

const MemoizedPost = memo(Post);
export default MemoizedPost;