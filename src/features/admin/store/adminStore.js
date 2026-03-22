import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminStore = create(
  persist(
    (set, get) => ({
      stats: null,
      users: [],
      loading: false,

      setStats: (stats) => set({ stats }),
      setUsers: (users) => set({ users }),
      setLoading: (loading) => set({ loading }),

      fetchStats: async (upaId) => {
        set({ loading: true });
        try {
          // Mock for now
          const mockStats = {
            total: 150,
            finalized: 120,
            canceled: 10,
            waiting: 20,
            avgWaitTime: 25,
            avgServiceTime: 15
          };
          set({ stats: mockStats });
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'admin-storage'
    }
  )
);
