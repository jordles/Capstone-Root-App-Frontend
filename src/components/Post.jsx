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

function Post({ post, onPostUpdated, onPostDeleted }) {
  const [userDetails, setUserDetails] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const optionsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserDetails = async () => {
      try {
        // First get the post details
        const postResponse = await axios.get(`https://capstone-root-app-backend.onrender.com/api/posts/id/${post._id}`);
        const postWithUser = postResponse.data;
        
        // Then fetch the user details using the user ID from the post
        const userResponse = await axios.get(`https://capstone-root-app-backend.onrender.com/api/users/${postWithUser.user}`);
        
        if (isMounted) {
          if (!userResponse.data) {
            setIsDeleted(true);
          } else {
            setUserDetails(userResponse.data);
            setIsDeleted(false);
          }
        }
      } catch (err) {
        console.error('Error fetching details:', err);
        // Don't set isDeleted here since we want to preserve loading state for other errors
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
      await axios.post(`https://capstone-root-app-backend.onrender.com/api/posts/${post._id}/like`);
      onPostUpdated(); // Notify parent to refresh posts
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, [post._id, onPostUpdated]);

  const handleDelete = async () => {
    try {
      // First get the post details to get the media URLs
      const postResponse = await axios.get(`https://capstone-root-app-backend.onrender.com/api/posts/id/${post._id}`);
      const postWithMedia = postResponse.data;
      
      // Delete the post first
      const response = await axios.delete(`https://capstone-root-app-backend.onrender.com/api/posts/${post._id}`);
      
      if (response.status === 200) {
        // If post deletion was successful, delete the media files from Cloudinary
        if (postWithMedia.mediaUrls && postWithMedia.mediaUrls.length > 0) {
          for (const url of postWithMedia.mediaUrls) {
            try {
              console.log('Processing URL:', url);
              // Extract public_id from Cloudinary URL
              const matches = url.match(/\/([^/]+)\.[^.]+$/);
              if (matches && matches[1]) {
                const publicId = matches[1];
                const resourceType = url.includes('/video/') ? 'video' : 'image';
                
                console.log('Extracted publicId:', publicId);
                console.log('Resource type:', resourceType);
                
                // Delete from Cloudinary
                const deleteResponse = await axios.post(`https://capstone-root-app-backend.onrender.com/api/cloudinary/delete`, {
                  publicId,
                  resourceType
                });
                console.log('Cloudinary delete response:', deleteResponse.data);
              } else {
                console.error('Could not extract publicId from URL:', url);
              }
            } catch (err) {
              console.error('Error deleting media from Cloudinary:', err.response?.data || err.message);
            }
          }
        }
        
        onPostDeleted(post._id); // Notify parent to refresh posts
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
          <h4>{isDeleted ? 'Deleted User' : (userDetails ? userDetails.name.display : 'loading...')}</h4>
          <span>@{isDeleted ? 'deleted' : (userDetails ? userDetails.name.handle : 'loading...')}</span>
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
            {post.mediaUrls.map((url, index) => {
              // Check if it's a video by looking at the file extension or Cloudinary URL format
              const isVideo = url.match(/\.(mp4|webm|ogg)$/) || 
                            url.includes('/video/') ||
                            url.startsWith('data:video');
              
              // All other URLs are treated as images
              const isImage = !isVideo;
              
              return (
                <div key={index} className="media-container">
                  {isImage ? (
                    <img src={url} alt={`Post media ${index + 1}`} />
                  ) : (
                    <video src={url} controls />
                  )}
                </div>
              );
            })}
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