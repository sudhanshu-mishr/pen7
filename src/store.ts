import { create } from 'zustand';
import { User } from './types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));
