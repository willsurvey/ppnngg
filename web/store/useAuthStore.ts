import { create } from 'zustand';
import { authApi } from '@/lib/api/authApi';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.login({ username, password });
      localStorage.setItem('admin_token', result.token);
      set({ token: result.token, isAuthenticated: true, loading: false });
      return true;
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login gagal';
      set({ error: message, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('admin_token');
    set({ token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      set({ token, isAuthenticated: !!token });
    }
  },

  clearError: () => set({ error: null }),
}));
