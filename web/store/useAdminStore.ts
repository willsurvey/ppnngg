import { create } from 'zustand';
import type { DashboardStats, CafeListItem, CafeDetail } from '@/types';
import { adminCafeApi } from '@/lib/api/adminApi';

interface AdminState {
  stats: DashboardStats | null;
  cafes: CafeListItem[];
  selectedCafe: CafeDetail | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchStats: () => Promise<void>;
  fetchCafes: (page?: number) => Promise<void>;
  fetchCafeDetail: (slug: string) => Promise<void>;
  deleteCafe: (id: number) => Promise<boolean>;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  cafes: [],
  selectedCafe: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const stats = await adminCafeApi.getDashboardStats();
      set({ stats, loading: false });
    } catch (error) {
      set({ error: 'Gagal memuat statistik', loading: false });
    }
  },

  fetchCafes: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const result = await adminCafeApi.getAllCafes(page);
      set({ cafes: result.data, loading: false });
    } catch (error) {
      set({ error: 'Gagal memuat data cafe', loading: false });
    }
  },

  fetchCafeDetail: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const cafe = await adminCafeApi.getAllCafes().then(() => null);
      set({ selectedCafe: cafe, loading: false });
    } catch (error) {
      set({ error: 'Gagal memuat detail cafe', loading: false });
    }
  },

  deleteCafe: async (id: number) => {
    try {
      await adminCafeApi.deleteCafe(id);
      return true;
    } catch (error) {
      set({ error: 'Gagal menghapus cafe' });
      return false;
    }
  },
}));
