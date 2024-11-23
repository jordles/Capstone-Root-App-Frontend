import { useState, useEffect, memo, useCallback } from 'react';
import axios from 'axios';
import './Post.css';

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

  const handleLike = useCallback(async () => {
    try {
      await axios.post(`http://localhost:3000/api/posts/${post._id}/like`);
      onPostUpdated(); // Notify parent to refresh posts
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [post._id, onPostUpdated]);

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
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="post-media">
            {post.mediaUrls.map((url, index) => (
              <div key={index} className="media-container">
                {url.startsWith('data:image') ? (
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
    </div>
  );
}

const MemoizedPost = memo(Post);
export default MemoizedPost;