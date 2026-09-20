import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/register', data);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async me() {
    const response = await api.get('/me');
    return response.data;
  },
};