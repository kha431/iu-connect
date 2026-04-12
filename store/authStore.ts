import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: any | null;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'iu-connect-auth', 
    }
  )
);