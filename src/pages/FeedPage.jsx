import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
// import TrendingTopics from '../components/TrendingTopics';
import Aside from '../components/aside/Aside';
import './FeedPage.css';

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    const loginID = localStorage.getItem('loginId');
    const userEmail = localStorage.getItem('userEmail');
    if (!userId || !loginID || !userEmail) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

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

  const addNewPost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
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
        <CreatePost onPostCreated={addNewPost} />
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
        <Aside />
      </div>
    </div>
  );
}

export default FeedPage;
