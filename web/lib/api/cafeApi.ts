import { publicApi } from './client';
import type {
  PaginatedResponse,
  CafeListItem,
  CafeDetail,
  FilterOptions,
  NearbyCafe,
  SearchResult,
  CafeFilters,
} from '@/types';

export const cafeApi = {
  async getAllCafes(filters: CafeFilters = {}): Promise<PaginatedResponse<CafeListItem>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await publicApi.get(`/cafes?${params.toString()}`);
    return data;
  },

  async getCafeBySlug(slug: string): Promise<CafeDetail> {
    const { data } = await publicApi.get(`/cafes/${slug}`);
    return data;
  },

  async searchCafes(query: string, limit: number = 5): Promise<SearchResult[]> {
    const { data } = await publicApi.get(`/cafes/search?q=${query}&limit=${limit}`);
    return data.data;
  },

  async getNearbyCafes(lat: number, lng: number, radius: number = 3): Promise<NearbyCafe[]> {
    const { data } = await publicApi.get(`/cafes/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return data.data;
  },

  async getFilterOptions(): Promise<FilterOptions> {
    const { data } = await publicApi.get('/cafes/filters/options');
    return data;
  },
};
