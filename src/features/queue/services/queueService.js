import api from '../../shared/lib/api';

export const queueService = {
  async getQueue(upaId) {
    const response = await api.get(`/queue/${upaId}`);
    return response.data;
  },

  async addPatient(data) {
    const response = await api.post('/queue/add', data);
    return response.data;
  },

  async callNext(data) {
    const response = await api.post('/queue/call-next', data);
    return response.data;
  },

  async updateStatus(patientId, status) {
    const response = await api.patch(`/queue/${patientId}/status`, { status });
    return response.data;
  }
};
