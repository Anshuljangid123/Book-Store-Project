import axios from 'axios';

const getBaseUrl = () => {
  // Client side: use the Next.js rewrite proxy to avoid Cloud IDE / CORS connectivity blocks
  if (typeof window !== 'undefined') return '/api';
  // Server side: directly hit the local backend instance
  return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3005';
};

// Base Axios instance
export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
