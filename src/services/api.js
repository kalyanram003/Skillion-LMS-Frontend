import axios from 'axios';

// Prefer REACT_APP_API_BASE_URL; fallback to legacy REACT_APP_API_URL
const rawBase = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'http://localhost:8090';
// Ensure we append "/api" exactly once
const API_BASE_URL = `${rawBase.replace(/\/$/, '')}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const idempotencyKey = localStorage.getItem('idempotencyKey') || generateIdempotencyKey();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    
    // Add idempotency key for POST requests
    if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
      config.headers['Idempotency-Key'] = idempotencyKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generate unique idempotency key
function generateIdempotencyKey() {
  const key = `idem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('idempotencyKey', key);
  return key;
}

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

// Course API
export const courseAPI = {
  getCourses: (limit = 10, offset = 0) => api.get(`/courses?limit=${limit}&offset=${offset}`),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  getLessonsByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
};

// Lesson API
export const lessonAPI = {
  getLessonById: (id) => api.get(`/lessons/${id}`),
  createLesson: (lessonData) => api.post('/lessons', lessonData),
};

// Enrollment API
export const enrollmentAPI = {
  enrollInCourse: (courseId) => api.post('/enrollments', { courseId }),
  completeLesson: (enrollmentId, lessonId) => api.post(`/enrollments/${enrollmentId}/complete-lesson`, { lessonId }),
  getProgress: () => api.get('/enrollments/progress'),
};

// Admin API
export const adminAPI = {
  getCoursesForReview: () => api.get('/admin/review/courses'),
  approveCourse: (courseId) => api.patch(`/admin/review/courses/${courseId}/approve`),
  approveCreator: (userId) => api.patch(`/admin/review/creators/${userId}/approve`),
};

// User API (for creator applications)
export const userAPI = {
  applyAsCreator: (bio, portfolioUrl) => api.post('/users/apply-creator', { bio, portfolioUrl }),
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
};

export default api;
