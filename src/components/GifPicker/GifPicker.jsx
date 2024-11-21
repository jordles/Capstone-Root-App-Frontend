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
      const debounceTimeout = setTimeout(() => {
        searchGifs(searchTerm);
      }, 300);
      return () => clearTimeout(debounceTimeout);
    }
  }, [searchTerm, searchGifs]);

  if (!isOpen) return null;

  return (
    <div className="gif-picker" ref={pickerRef}>
      <SearchBar 
        value={searchTerm}
        onChange={setSearchTerm}
        onToggleFavorites={() => setShowFavorites(prev => !prev)}
        showFavorites={showFavorites}
      />
      
      <GifGrid 
        gifs={showFavorites ? favorites : gifs}
        favorites={favorites}
        onGifSelect={handleGifSelect}
        onToggleFavorite={toggleFavorite}
        isLoading={isLoading}
      />
    </div>
  );
}

export default GifPicker;
