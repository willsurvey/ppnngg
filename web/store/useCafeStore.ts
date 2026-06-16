import { create } from 'zustand';
import type { CafeListItem, CafeFilters, FilterOptions, PaginatedResponse } from '@/types';
import { cafeApi } from '@/lib/api/cafeApi';

interface CafeState {
  cafes: CafeListItem[];
  pagination: { total: number; page: number; limit: number; total_pages: number };
  filters: CafeFilters;
  filterOptions: FilterOptions | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCafes: (filters?: CafeFilters) => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
  setFilter: (key: keyof CafeFilters, value: unknown) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const defaultFilters: CafeFilters = {
  page: 1,
  limit: 12,
};

export const useCafeStore = create<CafeState>((set, get) => ({
  cafes: [],
  pagination: { total: 0, page: 1, limit: 12, total_pages: 0 },
  filters: { ...defaultFilters },
  filterOptions: null,
  loading: false,
  error: null,

  fetchCafes: async (filters?: CafeFilters) => {
    set({ loading: true, error: null });
    try {
      const activeFilters = filters || get().filters;
      const result = await cafeApi.getAllCafes(activeFilters);
      set({
        cafes: result.data,
        pagination: result.pagination,
        loading: false,
      });
    } catch (error) {
      set({ error: 'Gagal memuat data cafe', loading: false });
    }
  },

  fetchFilterOptions: async () => {
    try {
      const options = await cafeApi.getFilterOptions();
      set({ filterOptions: options });
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  },

  setFilter: (key, value) => {
    const filters = { ...get().filters, [key]: value, page: 1 };
    set({ filters });
    get().fetchCafes(filters);
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
    get().fetchCafes(defaultFilters);
  },

  setPage: (page) => {
    const filters = { ...get().filters, page };
    set({ filters });
    get().fetchCafes(filters);
  },
}));
