import api from './axios';

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  googleAuth: async (googleData) => {
    const response = await api.post('/auth/google', googleData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
};

// Post services
export const postService = {
  getPosts: async (params) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  toggleUpvote: async (id) => {
    const response = await api.post(`/posts/${id}/upvote`);
    return response.data;
  },

  getMyPosts: async (params) => {
    const response = await api.get('/posts/my/posts', { params });
    return response.data;
  },

  submitForReview: async (id) => {
    const response = await api.post(`/posts/${id}/submit`);
    return response.data;
  },
};

// Comment services
export const commentService = {
  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  getCommentsByPost: async (postId, params) => {
    const response = await api.get(`/comments/${postId}`, { params });
    return response.data;
  },

  updateComment: async (id, content) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

// User services
export const userService = {
  getUserProfile: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  followUser: async (id) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  unfollowUser: async (id) => {
    const response = await api.delete(`/users/${id}/follow`);
    return response.data;
  },

  getFollowers: async (id) => {
    const response = await api.get(`/users/${id}/followers`);
    return response.data;
  },

  getFollowing: async (id) => {
    const response = await api.get(`/users/${id}/following`);
    return response.data;
  },
};

// Notification services
export const notificationService = {
  getNotifications: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};

// Admin services
export const adminService = {
  getPendingPosts: async (params) => {
    const response = await api.get('/admin/posts/pending', { params });
    return response.data;
  },

  approvePost: async (id) => {
    const response = await api.put(`/admin/posts/${id}/approve`);
    return response.data;
  },

  rejectPost: async (id, reason) => {
    const response = await api.put(`/admin/posts/${id}/reject`, { reason });
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  },

  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/deactivate`);
    return response.data;
  },

  activateUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/activate`);
    return response.data;
  },

  banUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/ban`);
    return response.data;
  },

  unbanUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/unban`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// Dashboard services
export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getAuthorDashboard: async () => {
    const response = await api.get('/dashboard/author');
    return response.data;
  },

  getReaderDashboard: async () => {
    const response = await api.get('/dashboard/reader');
    return response.data;
  },
};
