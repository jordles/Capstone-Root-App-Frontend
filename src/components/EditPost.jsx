import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PostButton from './PostButton';
import EmojiPicker from 'emoji-picker-react';
import MediaPreview from './MediaPreview';
import GifPicker from './GifPicker/GifPicker';
import Card from './Card';
import './CreatePost.css';

function EditPost({ post, onClose, onPostUpdated }) {
  const [editedPost, setEditedPost] = useState(post.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [mediaList, setMediaList] = useState(
    post.mediaUrls ? post.mediaUrls.map((url, index) => ({
      id: index,
      type: url.startsWith('data:video') ? 'video' : 'image',
      url
    })) : []
  );
  
  const emojiPickerRef = useRef(null);
  const gifPickerRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (gifPickerRef.current && !gifPickerRef.current.contains(event.target)) {
        setShowGifPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editedPost.trim() && mediaList.length === 0) return;
    
    try {
      const response = await axios.patch(`http://localhost:3000/api/posts/${post._id}`, {
        content: editedPost,
        mediaUrls: mediaList.map(media => media.url)
      });
      
      onPostUpdated(response.data);
      onClose();
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleEmojiClick = useCallback((emojiData) => {
    setEditedPost(prev => prev + emojiData.emoji);
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

  const handleGifSelect = useCallback((gifUrl) => {
    const newMedia = {
      id: Date.now(),
      type: 'image',
      url: gifUrl
    };
    setMediaList(prev => [...prev, newMedia]);
    setShowGifPicker(false);
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <Card>
          <div className="post-create-card">
            <form onSubmit={handleSubmit}>
              <textarea
                value={editedPost}
                onChange={(e) => setEditedPost(e.target.value)}
                placeholder="What's on your mind?"
                rows={8}
                maxLength={500}
              />
              <div className="char-count">
                {500 - editedPost.length} characters remaining
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
                  <div className="gif-picker-container">
                    <PostButton
                      icon="gif"
                      label="Add GIF"
                      onClick={() => setShowGifPicker(!showGifPicker)}
                    />
                    {showGifPicker && (
                      <div className="gif-picker-popup" ref={gifPickerRef}>
                        <GifPicker
                          isOpen={showGifPicker}
                          onClose={() => setShowGifPicker(false)}
                          onGifSelect={handleGifSelect}
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
                </div>
                <div className="edit-actions">
                  <PostButton
                    icon="close"
                    label="Cancel"
                    className="delete-button"
                    onClick={onClose}
                  />
                  <PostButton
                    icon="check"
                    label="Save"
                    type="submit"
                    className="highlight-button"
                    disabled={!editedPost.trim() && mediaList.length === 0}
                  />
                </div>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EditPost;
