// src/api.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL; // set via Render env

const api = axios.create({
  baseURL: BASE_URL,            // e.g. https://gicpl-fullstack-backend.onrender.com
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or Redux
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
