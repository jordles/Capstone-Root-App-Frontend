import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PostButton from './PostButton';
import EmojiPicker from 'emoji-picker-react';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
  const [newPost, setNewPost] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    try {
      await axios.post('http://localhost:3000/api/posts', { content: newPost });
      setNewPost('');
      onPostCreated(); // Notify parent to refresh posts
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewPost(prev => prev + emojiData.emoji);
  };

  const handleImageClick = () => {
    // TODO: Implement image upload
    console.log('Image upload clicked');
  };

  const handleVideoClick = () => {
    // TODO: Implement video upload
    console.log('Video upload clicked');
  };

  const handleGifClick = () => {
    // TODO: Implement GIF selection
    console.log('GIF selection clicked');
  };

  return (
    <div className="post-create-card">
      <form onSubmit={handleSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          maxLength={500}
        />
        <div className="char-count">
          {500 - newPost.length} characters remaining
        </div>
        <div className="post-actions">
          <div className="post-media-buttons">
            <div className="emoji-picker-container">
              <PostButton
                icon="add_reaction"
                label="Add emoji"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {showEmojiPicker && (
                <div className="emoji-picker-popup" ref={emojiPickerRef}>
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                    width={320}
                    height={400}
                    skinTonePickerLocation="PREVIEW"
                    emojiStyle="native"
                  />
                </div>
              )}
            </div>
            <PostButton
              icon="image"
              label="Add image"
              onClick={handleImageClick}
            />
            <PostButton
              icon="videocam"
              label="Add video"
              onClick={handleVideoClick}
            />
            <PostButton
              icon="gif"
              label="Add GIF"
              onClick={handleGifClick}
            />
          </div>
          <PostButton
            icon="send"
            label="Post"
            type="submit"
            disabled={!newPost.trim()}
          />
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
