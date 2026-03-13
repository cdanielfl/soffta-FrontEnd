import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  profile: null,
  loading: false,

  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  updateProfile: async (data) => {
    set({ loading: true });
    try {
      // Mock update
      set({ profile: { ...get().profile, ...data } });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      set({ loading: false });
    }
  }
}));