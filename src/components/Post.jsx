import axios from 'axios';
import './Post.css';

function Post({ post, onPostUpdated }) {
  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:3000/api/posts/${post._id}/like`);
      onPostUpdated(); // Notify parent to refresh posts
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src="https://via.placeholder.com/50" alt="Author" />
        <div>
          <h4>{post.author || 'Plant Lover'}</h4>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
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

export default Post;
