import { memo } from 'react'; // prevent unnecessary re-renders when react re-renders media preview because of parent re-renders
import PostButton from './PostButton';
import './MediaPreview.css';

const MediaPreview = memo(function MediaPreview({ mediaType, mediaUrl, onRemove }) {
  return (
    <div className="media-preview">
      {mediaType === 'image' ? (
        <img src={mediaUrl} alt="Selected" loading="lazy" />
      ) : mediaType === 'video' ? (
        <video src={mediaUrl} controls preload="metadata" />
      ) : null}
      
      <PostButton 
        className="remove-media"
        icon="close"
        label="Remove"
        onClick={onRemove}
        type="button"
      />
    </div>
  );
});

export default MediaPreview;
