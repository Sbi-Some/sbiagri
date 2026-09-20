import api from './api';

export const cultureService = {
  async getAll(params = {}) {
    const response = await api.get('/cultures', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/cultures/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/cultures', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/cultures/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/cultures/${id}`);
    return response.data;
  },
};