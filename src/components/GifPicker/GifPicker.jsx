import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './GifPicker.css';
import SearchBar from './SearchBar';
import GifGrid from './GifGrid';
import { useClickOutside } from '../../hooks/useClickOutside';

const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY; // Move to .env file
const TENOR_API_URL = 'https://tenor.googleapis.com/v2';

function GifPicker({ onGifSelect, onClose, isOpen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoriteGifs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const pickerRef = useRef(null);

  useClickOutside(pickerRef, onClose);

  const searchGifs = useCallback(async (term) => {
    if (!term) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${TENOR_API_URL}/search`, {
        params: {
          q: term,
          key: TENOR_API_KEY,
          client_key: 'root_app',
          limit: 20
        }
      });
      setGifs(response.data.results);
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback((gif) => {
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.id === gif.id);
      const newFavorites = isFavorited
        ? prev.filter(fav => fav.id !== gif.id)
        : [...prev, gif];
      
      localStorage.setItem('favoriteGifs', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const handleGifSelect = useCallback((gif) => {
    onGifSelect(gif.media_formats.gif.url);
    onClose();
  }, [onGifSelect, onClose]);

  useEffect(() => {
    if (searchTerm) {
      if (showFavorites) {
        // Don't make API call when searching favorites
        return;
      }
      const debounceTimeout = setTimeout(() => {
        searchGifs(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimeout);
    }
  }, [searchTerm, searchGifs, showFavorites]);

  const filteredGifs = showFavorites 
    ? favorites.filter(gif => {
        const searchLower = searchTerm.toLowerCase();
        // Search through all available properties
        return  gif.content_description?.toLowerCase().includes(searchLower) ||
                gif.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
                gif.itemurl?.toLowerCase().includes(searchLower);
      })
    : gifs;

  if (!isOpen) return null;

  return (
    <div className="gif-picker" ref={pickerRef}>
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        onToggleFavorites={() => {
          setShowFavorites(prev => !prev);
          setSearchTerm(''); // Clear search when toggling
        }}
        showFavorites={showFavorites}
      />
      
      <GifGrid 
        //gifs={showFavorites ? favorites : gifs}
        gifs={filteredGifs}
        favorites={favorites}
        onGifSelect={handleGifSelect}
        onToggleFavorite={toggleFavorite}
        isLoading={isLoading && !showFavorites}
        //isLoading={isLoading}
      />
    </div>
  );
}

export default GifPicker;
