import { adminApi } from './client';
import type {
  DashboardStats,
  CafeDetail,
  CreateCafeRequest,
  UpdateCafeRequest,
  FotoCafe,
  PaginatedResponse,
  CafeListItem,
  JamBukaInput,
} from '@/types';

export const adminCafeApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await adminApi.get('/admin/dashboard/stats');
    return data;
  },

  async getAllCafes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<CafeListItem>> {
    const { data } = await adminApi.get(`/cafes?page=${page}&limit=${limit}`);
    return data;
  },

  async getCafeById(id: number): Promise<CafeDetail> {
    const { data } = await adminApi.get(`/admin/cafes/${id}`);
    return data;
  },

  async createCafe(cafeData: CreateCafeRequest): Promise<CafeDetail> {
    const { data } = await adminApi.post('/admin/cafes', cafeData);
    return data;
  },

  async updateCafe(id: number, cafeData: UpdateCafeRequest): Promise<CafeDetail> {
    const { data } = await adminApi.put(`/admin/cafes/${id}`, cafeData);
    return data;
  },

  async deleteCafe(id: number): Promise<void> {
    await adminApi.delete(`/admin/cafes/${id}`);
  },

  async setKategori(cafeId: number, kategoriIds: number[]): Promise<CafeDetail> {
    const { data } = await adminApi.put(`/admin/cafes/${cafeId}/kategori`, { kategori_ids: kategoriIds });
    return data;
  },

  async setFasilitas(cafeId: number, fasilitasIds: number[]): Promise<CafeDetail> {
    const { data } = await adminApi.put(`/admin/cafes/${cafeId}/fasilitas`, { fasilitas_ids: fasilitasIds });
    return data;
  },

  async setJamBuka(cafeId: number, jamBuka: JamBukaInput[]): Promise<CafeDetail> {
    const { data } = await adminApi.put(`/admin/cafes/${cafeId}/jam-buka`, { jam_buka: jamBuka });
    return data;
  },

  async uploadFoto(cafeId: number, formData: FormData): Promise<FotoCafe> {
    const { data } = await adminApi.post(`/admin/cafes/${cafeId}/fotos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async deleteFoto(fotoId: number): Promise<void> {
    await adminApi.delete(`/admin/fotos/${fotoId}`);
  },

  async reorderFotos(cafeId: number, urutan: number[]): Promise<void> {
    await adminApi.put(`/admin/cafes/${cafeId}/fotos/reorder`, { urutan });
  },
};
