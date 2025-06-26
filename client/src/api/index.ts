import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Optional: add `/api` if your backend is namespaced
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Interceptors for logging or attaching tokens
api.interceptors.request.use(
  (config) => {
    // Example: Add token if needed
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Handle 401s, etc.
    // if (error.response?.status === 401) {
    //   redirectToLogin();
    // }
    return Promise.reject(error);
  }
);

export default api;
