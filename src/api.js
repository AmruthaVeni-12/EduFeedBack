// API Configuration and Service Functions
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// Subject APIs
export const subjectAPI = {
  getAll: () => apiCall('/subjects'),

  create: (subjectData) => apiCall('/subjects', {
    method: 'POST',
    body: JSON.stringify(subjectData),
  }),

  update: (id, subjectData) => apiCall(`/subjects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(subjectData),
  }),

  delete: (id) => apiCall(`/subjects/${id}`, {
    method: 'DELETE',
  }),
};

// Section APIs
export const sectionAPI = {
  getAll: () => apiCall('/sections'),

  create: (subjectId, sectionData) => apiCall(`/sections?subjectId=${subjectId}`, {
    method: 'POST',
    body: JSON.stringify(sectionData),
  }),

  update: (id, sectionData) => apiCall(`/sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(sectionData),
  }),

  delete: (id) => apiCall(`/sections/${id}`, {
    method: 'DELETE',
  }),
};

// Student APIs
export const studentAPI = {
  getAll: () => apiCall('/students'),

  create: (studentData) => apiCall('/students', {
    method: 'POST',
    body: JSON.stringify(studentData),
  }),

  update: (id, studentData) => apiCall(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(studentData),
  }),

  delete: (id) => apiCall(`/students/${id}`, {
    method: 'DELETE',
  }),
};

// Feedback Form APIs
export const feedbackFormAPI = {
  getAll: () => apiCall('/forms'),

  create: (formData) => apiCall('/forms', {
    method: 'POST',
    body: JSON.stringify(formData),
  }),

  getById: (id) => apiCall(`/forms/${id}`),

  update: (id, formData) => apiCall(`/forms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
  }),

  delete: (id) => apiCall(`/forms/${id}`, {
    method: 'DELETE',
  }),
};

// Feedback Submission APIs
export const submissionAPI = {
  getAll: () => apiCall('/submissions'),

  create: (submissionData) => apiCall('/submissions', {
    method: 'POST',
    body: JSON.stringify(submissionData),
  }),

  getByForm: (formId) => apiCall(`/submissions/form/${formId}`),
};

// Suggestion APIs
export const suggestionAPI = {
  getAll: () => apiCall('/suggestions'),

  create: (suggestionData) => apiCall('/suggestions', {
    method: 'POST',
    body: JSON.stringify(suggestionData),
  }),

  update: (id, suggestionData) => apiCall(`/suggestions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(suggestionData),
  }),

  delete: (id) => apiCall(`/suggestions/${id}`, {
    method: 'DELETE',
  }),
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