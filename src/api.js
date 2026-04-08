import axios from 'axios';

// API Configuration and Service Functions
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      return Promise.reject(new Error(`API Error: ${status} - ${JSON.stringify(data)}`));
    }
    if (error.request) {
      return Promise.reject(new Error('Unable to contact the backend server at http://localhost:8080. Make sure the Spring Boot backend is running.'));
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),

  login: (credentials) => apiClient.post('/auth/login', credentials),
};

// Subject APIs
export const subjectAPI = {
  getAll: () => apiClient.get('/subjects'),

  create: (subjectData) => apiClient.post('/subjects', subjectData),

  update: (id, subjectData) => apiClient.put(`/subjects/${id}`, subjectData),

  delete: (id) => apiClient.delete(`/subjects/${id}`),
};

// Section APIs
export const sectionAPI = {
  getAll: () => apiClient.get('/sections'),

  create: (subjectId, sectionData) => apiClient.post(`/sections?subjectId=${subjectId}`, sectionData),

  update: (id, sectionData) => apiClient.put(`/sections/${id}`, sectionData),

  delete: (id) => apiClient.delete(`/sections/${id}`),
};

// Student APIs
export const studentAPI = {
  getAll: () => apiClient.get('/students'),

  create: (studentData) => apiClient.post('/students', studentData),

  update: (id, studentData) => apiClient.put(`/students/${id}`, studentData),

  delete: (id) => apiClient.delete(`/students/${id}`),
};

// Feedback Form APIs
export const feedbackFormAPI = {
  getAll: () => apiClient.get('/forms'),

  create: (formData) => apiClient.post(`/forms?sectionId=${formData.sectionId}`, formData),

  getById: (id) => apiClient.get(`/forms/${id}`),

  update: (id, formData) => apiClient.put(`/forms/${id}`, formData),

  delete: (id) => apiClient.delete(`/forms/${id}`),
};

// Feedback Submission APIs
export const submissionAPI = {
  getAll: () => apiClient.get('/submissions'),

  create: (submissionData) => apiClient.post('/submissions', submissionData),

  getByForm: (formId) => apiClient.get(`/submissions/form/${formId}`),
};

// Suggestion APIs
export const suggestionAPI = {
  getAll: () => apiClient.get('/suggestions'),

  create: (suggestionData) => apiClient.post('/suggestions', suggestionData),

  update: (id, suggestionData) => apiClient.put(`/suggestions/${id}`, suggestionData),

  delete: (id) => apiClient.delete(`/suggestions/${id}`),
};

export default {
  authAPI,
  subjectAPI,
  sectionAPI,
  studentAPI,
  feedbackFormAPI,
  submissionAPI,
  suggestionAPI,
};