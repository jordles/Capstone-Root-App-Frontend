import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PostButton from './PostButton';
import EmojiPicker from 'emoji-picker-react';
import MediaPreview from './MediaPreview';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
  const [newPost, setNewPost] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const emojiPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No user ID found');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/posts/add', {
        user: userId,
        content: newPost,
        mediaUrls: mediaList.map(media => media.url)
      });
      
      const createdPost = response.data.newPost;
      onPostCreated(createdPost);
      
      setNewPost('');
      setMediaList([]);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleEmojiClick = useCallback((emojiData) => {
    setNewPost(prev => prev + emojiData.emoji);
  }, []);

  const handleImageClick = useCallback(() => {
    imageInputRef.current.click();
  }, []);

  const handleVideoClick = useCallback(() => {
    videoInputRef.current.click();
  }, []);

  const removeMedia = useCallback((mediaId) => {
    setMediaList(prev => prev.filter(media => media.id !== mediaId));
  }, []);

  const handleMediaChange = useCallback((e, type) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size too large. Please choose a ${type} under ${maxSize / (1024 * 1024)}MB.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        let url = reader.result;
        if (type === 'image') {
          if (file.type === 'image/gif') {
            const newMedia = {
              id: Date.now(),
              type,
              url,
              file
            };
            setMediaList(prev => [...prev, newMedia]);
          } else {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              const maxWidth = 1200;
              const maxHeight = 1200;
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > maxWidth) {
                  height *= maxWidth / width;
                  width = maxWidth;
                }
              } else {
                if (height > maxHeight) {
                  width *= maxHeight / height;
                  height = maxHeight;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              
              ctx.drawImage(img, 0, 0, width, height);
              const compressedUrl = canvas.toDataURL('image/jpeg', 0.8);
              
              const newMedia = {
                id: Date.now(),
                type,
                url: compressedUrl,
                file
              };
              setMediaList(prev => [...prev, newMedia]);
            };
          }
        } else {
          const newMedia = {
            id: Date.now(),
            type,
            url,
            file
          };
          setMediaList(prev => [...prev, newMedia]);
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGifClick = useCallback(() => {
    console.log('GIF selection clicked');
  }, []);

  return (
    <div className="post-create-card">
      <form onSubmit={handleSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          rows={8}
          maxLength={500}
        />
        <div className="char-count">
          {500 - newPost.length} characters remaining
        </div>
        <div className="media-preview-list">
          {mediaList.map(media => (
            <MediaPreview
              key={media.id}
              mediaType={media.type}
              mediaUrl={media.url}
              onRemove={() => removeMedia(media.id)}
            />
          ))}
        </div>
        <input 
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleMediaChange(e, 'image')}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <input 
          type="file"
          ref={videoInputRef}
          onChange={(e) => handleMediaChange(e, 'video')}
          accept="video/*"
          style={{ display: 'none' }}
        />
        
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
