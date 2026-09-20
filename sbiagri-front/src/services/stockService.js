import api from './api';

export const stockService = {
  async getAll(params = {}) {
    const response = await api.get('/stocks', { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post('/stocks', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/stocks/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/stocks/${id}`);
    return response.data;
  },
};