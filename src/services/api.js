import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSessions = async () => {
  const response = await api.get('/users/sessions');
  return response.data;
};

export default api;
