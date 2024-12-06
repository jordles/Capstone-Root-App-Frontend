import React, { useState, useRef, useCallback } from 'react';
import PostButton from './PostButton';
import EmojiPicker from 'emoji-picker-react';
import MediaPreview from './MediaPreview';
import GifPicker from './GifPicker/GifPicker';
import { cloudinaryConfig } from '../config/cloudinary';
import './CreatePost.css';

function CreatePost({ onPostCreated }) {
  const [newPost, setNewPost] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); //toggle popup windows
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const emojiPickerRef = useRef(null); //reference our dom elements
  const gifPickerRef = useRef(null); // reference when we want to close the gif picker for example. 
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && mediaList.length === 0) return;
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to create a post');
        return;
      }

      // Extract media URLs from mediaList
      const mediaUrls = mediaList.map(media => media.url);
      console.log('Current mediaList:', mediaList);
      console.log('Extracted mediaUrls:', mediaUrls);

      const postData = {
        user: userId,
        content: newPost.trim(),
        mediaUrls: mediaUrls
      };

      console.log('Sending post data:', postData);

      const response = await fetch('https://capstone-root-app-backend.onrender.com/api/posts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create post');
      }
      
      const { newPost: createdPost } = responseData;
      console.log('Post created successfully:', createdPost);
      
      // Clear form and media list
      setNewPost('');
      setMediaList([]);
      setShowEmojiPicker(false);
      setShowGifPicker(false);
      
      // Reset file inputs
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
      
      // Notify parent component
      onPostCreated(createdPost);
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error.message || 'Failed to create post. Please try again.');
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

  const handleMediaChange = useCallback(async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 500 * 1024 * 1024; // 500MB for both video and images
      if (file.size > maxSize) {
        alert(`File size too large. Please choose a ${type} under 500MB.`);
        return;
      }

      const uploadToCloudinary = async (fileToUpload) => {
        try {
          console.log('Starting Cloudinary upload for file:', {
            name: fileToUpload.name,
            type: fileToUpload.type,
            size: fileToUpload.size
          });

          const formData = new FormData();
          formData.append('file', fileToUpload);
          formData.append('upload_preset', cloudinaryConfig.uploadPreset);
          formData.append('timestamp', Date.now()/1000);
          formData.append('api_key', cloudinaryConfig.apiKey);

          console.log('Uploading to Cloudinary with config:', {
            cloudName: cloudinaryConfig.cloudName,
            uploadPreset: cloudinaryConfig.uploadPreset
          });

          const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${fileToUpload.type.startsWith('video') ? 'video' : 'image'}/upload`;
          console.log('Upload URL:', uploadUrl);

          const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
          });

          console.log('Cloudinary response status:', response.status);
          const data = await response.json();
          
          if (!response.ok) {
            console.error('Cloudinary error response:', data);
            throw new Error(data.error?.message || 'Upload failed');
          }

          console.log('Cloudinary upload successful:', data);
          // Return both URL and public_id for deletion later
          return {
            url: data.secure_url,
            publicId: data.public_id
          };
        } catch (error) {
          console.error('Upload error details:', {
            message: error.message,
            stack: error.stack
          });
          alert(`Failed to upload file: ${error.message}`);
          return null;
        }
      };

      if (type === 'image' && file.type !== 'image/gif') {
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = (e) => {
          img.src = e.target.result;
        };

        img.onload = async () => {
          console.log('Processing image before upload:', {
            originalWidth: img.width,
            originalHeight: img.height,
            type: file.type
          });

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
          
          console.log('Image compressed to:', {
            newWidth: width,
            newHeight: height
          });

          canvas.toBlob(async (blob) => {
            const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
            console.log('Compressed file created:', {
              name: compressedFile.name,
              type: compressedFile.type,
              size: compressedFile.size
            });

            const result = await uploadToCloudinary(compressedFile);
            if (result) {
              const newMedia = {
                id: Date.now(),
                type,
                url: result.url,
                publicId: result.publicId,
                file: null
              };
              console.log('Adding new media to list:', newMedia);
              setMediaList(prev => {
                const updated = [...prev, newMedia];
                console.log('Updated media list:', updated);
                return updated;
              });
            }
          }, 'image/jpeg', 0.8);
        };

        reader.readAsDataURL(file);
      } else {
        // For GIFs and videos, upload directly
        console.log('Uploading file directly:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        const result = await uploadToCloudinary(file);
        if (result) {
          const newMedia = {
            id: Date.now(),
            type,
            url: result.url,
            publicId: result.publicId,
            file: null
          };
          console.log('Adding new media to list:', newMedia);
          setMediaList(prev => {
            const updated = [...prev, newMedia];
            console.log('Updated media list:', updated);
            return updated;
          });
        }
      }
    }
  }, []);

  const handleGifSelect = useCallback((gifUrl) => {
    const newMedia = {
      id: Date.now(),
      type: 'image',
      url: gifUrl,
      publicId: null,
      file: null
    };
    setMediaList(prev => [...prev, newMedia]);
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
          <PostButton
            icon="send"
            label="Post"
            type="submit"
            disabled={!newPost.trim() && mediaList.length === 0}
          />
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
