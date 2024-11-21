import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import TrendingTopics from '../components/TrendingTopics';
import './FeedPage.css';

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/posts/feed');
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="feed-container">
      <div className="feed-left">
        <ProfileCard />
      </div>

      <div className="feed-main">
        <CreatePost onPostCreated={fetchPosts} />
        <div className="posts-container">
          {posts.length === 0 ? (
            <div className="no-posts">No posts yet. Be the first to share!</div>
          ) : (
            posts.map((post) => (
              <Post 
                key={post._id} 
                post={post} 
                onPostUpdated={fetchPosts}
              />
            ))
          )}
        </div>
      </div>

      <div className="feed-right">
        <TrendingTopics />
      </div>
    </div>
  );
}

export default FeedPage;
