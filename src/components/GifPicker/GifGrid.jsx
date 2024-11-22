import { memo } from 'react';
import './GifGrid.css';

const GifGrid = memo(function GifGrid({ 
  gifs, 
  favorites, 
  onGifSelect, 
  onToggleFavorite, 
  isLoading 
}) {
  if (isLoading) {
    return <div className="gif-loading">Loading...</div>;
  }

  if (gifs.length === 0) {
    return <div className="gif-empty">Powered By Tenor</div>;
  }

  return (
    <div className="gif-grid">
      {gifs.map(gif => {
        const isFavorited = favorites.some(fav => fav.id === gif.id);
        
        return (
          <div key={gif.id} className="gif-item">
            <div className="gif-wrapper">
              <img 
                src={gif.media_formats.tinygif.url} 
                alt={gif.content_description}
                onClick={() => onGifSelect(gif)}
                loading="lazy"
              />
              <button
                className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
                onClick={() => onToggleFavorite(gif)}
                title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <span className="heart-icon">
                  {isFavorited ? '❤️' : '🤍'}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default GifGrid;
