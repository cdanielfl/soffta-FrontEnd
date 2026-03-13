import api from '../../shared/lib/api';

export const profileService = {
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.patch('/profile', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await api.patch('/profile/password', data);
    return response.data;
  }
};