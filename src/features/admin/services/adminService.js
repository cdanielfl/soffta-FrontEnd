import api from '../../../shared/lib/api';

export const adminService = {
  async getStats(upaId) {
    const response = await api.get(`/admin/stats/${upaId}`);
    return response.data;
  },

  async getUsers(upaId) {
    const response = await api.get(`/admin/users/${upaId}`);
    return response.data;
  },

  async updateUser(userId, data) {
    const response = await api.patch(`/admin/users/${userId}`, data);
    return response.data;
  }
};

