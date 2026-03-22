import api from '../../../shared/lib/api';

const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user, accessToken, refreshToken };
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { accessToken, refreshToken, user } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    return { user, accessToken, refreshToken };
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { token: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh', { token: refreshToken });
    const { accessToken } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  }
};

export default authService;

