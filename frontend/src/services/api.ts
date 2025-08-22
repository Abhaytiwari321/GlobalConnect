const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (userData: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: any) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest('/auth/me'),

  updateProfile: (formData: FormData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    }),
};

// Posts API
export const postsAPI = {
  getPosts: (page = 1, limit = 10) =>
    apiRequest(`/posts?page=${page}&limit=${limit}`),

  createPost: (formData: FormData) =>
    apiRequest('/posts', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    }),

  likePost: (postId: string) =>
    apiRequest(`/posts/${postId}/like`, {
      method: 'POST',
    }),

  commentPost: (postId: string, content: string) =>
    apiRequest(`/posts/${postId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  deletePost: (postId: string) =>
    apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    }),
};

// Jobs API
export const jobsAPI = {
  getJobs: (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiRequest(`/jobs?${params.toString()}`);
  },

  getJob: (jobId: string) => apiRequest(`/jobs/${jobId}`),

  createJob: (formData: FormData) =>
    apiRequest('/jobs', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    }),

  applyJob: (jobId: string, formData: FormData) =>
    apiRequest(`/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    }),

  saveJob: (jobId: string) =>
    apiRequest(`/jobs/${jobId}/save`, {
      method: 'POST',
    }),
};

// Users API
export const usersAPI = {
  getUsers: (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    return apiRequest(`/users?${params.toString()}`);
  },

  getUser: (userId: string) => apiRequest(`/users/${userId}`),

  connectUser: (userId: string, message?: string) =>
    apiRequest(`/users/${userId}/connect`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  getConnectionRequests: () => apiRequest('/users/connection-requests'),

  acceptConnectionRequest: (requestId: string) =>
    apiRequest(`/users/connection-requests/${requestId}/accept`, {
      method: 'POST',
    }),
};