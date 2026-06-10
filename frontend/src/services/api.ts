import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  role: 'consultant' | 'manager';
  created_at: string;
}

export interface TestCaseFile {
  id: number;
  filename: string;
  row_count: number;
  status: 'uploaded' | 'processed' | 'failed';
  uploaded_at: string;
}

export default api;
