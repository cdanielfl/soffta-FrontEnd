import api from '../../shared/lib/api';

export const customizationService = {
  async getCustomization(upaId) {
    const response = await api.get(`/customization/${upaId}`);
    return response.data;
  },

  async updateCustomization(upaId, data) {
    const response = await api.patch(`/customization/${upaId}`, data);
    return response.data;
  }
};
