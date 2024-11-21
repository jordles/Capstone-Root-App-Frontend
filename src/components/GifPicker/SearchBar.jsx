import { memo } from 'react';
import './SearchBar.css';

const SearchBar = memo(function SearchBar({ value, onChange, onToggleFavorites, showFavorites }) {
  return (
    <div className="gif-search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search GIFs..."
        className="gif-search-input"
      />
      <button 
        className={`favorite-toggle ${showFavorites ? 'active' : ''}`}
        onClick={onToggleFavorites}
        title={showFavorites ? 'Show Search Results' : 'Show Favorites'}
      >
        ❤️
      </button>
    </div>
  );
});

export default SearchBar;
