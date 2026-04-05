import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
    return;
  }

  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem('token');
};

export const getErrorMessage = (error, fallbackMessage = 'Something went wrong') => {
  const responseData = error.response?.data;

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors[0].msg;
  }

  return responseData?.message || error.message || fallbackMessage;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
