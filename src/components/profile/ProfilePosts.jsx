import { useState } from 'react';
import Post from '../Post';
import './ProfilePosts.css';

const ProfilePosts = ({ posts, onPostsUpdated }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'media', label: 'Media' },
    { id: 'likes', label: 'Likes' }
  ];

  const filteredPosts = posts?.filter(post => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'media') return post.image;
    if (activeCategory === 'likes') return post.likes?.length > 0;
    return true;
  });

  const handlePostUpdated = () => {
    if (onPostsUpdated) {
      onPostsUpdated();
    }
  };

  const handlePostDeleted = (postId) => {
    if (onPostsUpdated) {
      onPostsUpdated();
    }
  };

  return (
    <div className="profile-posts">
      <h2 className="posts-heading">Posts</h2>
      <div className="post-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <div className="posts-container">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <Post 
              key={post._id} 
              post={post} 
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))
        ) : (
          <div className="no-posts">
            <p>No posts in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;
