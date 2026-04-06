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

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  getMe: () => api.get('/auth/me')
};

export const therapistApi = {
  getAll: () => api.get('/therapists'),
  getStats: () => api.get('/therapists/stats'),
  getAvailability: (params = {}) => api.get('/therapists/availability', { params }),
  addAvailability: (payload) => api.post('/therapists/availability', payload),
  deleteAvailability: (id) => api.delete(`/therapists/availability/${id}`)
};

export const appointmentApi = {
  book: (payload) => api.post('/appointments/book', payload),
  getStudentAppointments: () => api.get('/appointments/student'),
  getTherapistAppointments: () => api.get('/appointments/therapist'),
  updateStatus: (id, payload) => api.put(`/appointments/${id}/status`, payload),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailableSlots: (params) => api.get('/appointments/available-slots', { params })
};

export const wellbeingApi = {
  getQuestionnaires: () => api.get('/wellbeing/questionnaires'),
  submit: (payload) => api.post('/wellbeing/submit', payload),
  getHistory: () => api.get('/wellbeing/history'),
  getTrends: () => api.get('/wellbeing/trends'),
  getLatestStudents: () => api.get('/wellbeing/students/latest'),
  getStudentWellbeing: (studentId) => api.get(`/wellbeing/student/${studentId}`)
};

export const resourceApi = {
  getAll: (params = {}) => api.get('/resources', { params }),
  getCategories: () => api.get('/resources/categories')
};

export const sessionNoteApi = {
  getByAppointment: (appointmentId) => api.get(`/session-notes/appointment/${appointmentId}`),
  getStudentNotes: () => api.get('/session-notes/student'),
  create: (payload) => api.post('/session-notes', payload),
  update: (noteId, payload) => api.put(`/session-notes/${noteId}`, payload)
};

export default api;
