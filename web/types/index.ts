// === Master Data Entities ===

export interface Lokasi {
  id: number;
  nama_kecamatan: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi?: string | null;
}

export interface Fasilitas {
  id: number;
  nama_fasilitas: string;
  icon?: string | null;
}

// === Core Entities ===

export interface FotoCafe {
  id: number;
  url_foto: string;
  urutan: number;
  caption: string | null;
}

export interface JamBuka {
  id: number;
  hari: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';
  jam_buka: string | null;
  jam_tutup: string | null;
  is_tutup: boolean;
}

export interface Cafe {
  id: number;
  nama_cafe: string;
  slug: string;
  alamat: string;
  lokasi: Lokasi | null;
  harga_min: number;
  harga_max: number;
  sesi_buka: 'pagi' | 'siang' | 'malam';
  thumbnail?: string | null;
  kategori: Kategori[];
  fasilitas: Fasilitas[];
  completeness_score: number;
}

export interface CafeDetail extends Cafe {
  latitude: number;
  longitude: number;
  no_telepon: string;
  deskripsi: string;
  jam_buka: JamBuka[];
  fotos: FotoCafe[];
}

export interface CafeListItem {
  id: number;
  nama_cafe: string;
  slug: string;
  alamat: string;
  lokasi: Lokasi | null;
  harga_min: number;
  harga_max: number;
  sesi_buka: string;
  thumbnail: string | null;
  kategori: Kategori[];
  fasilitas: Fasilitas[];
  completeness_score: number;
}

// === API Response Types ===

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface FilterOptions {
  lokasi: Lokasi[];
  kategori: Kategori[];
  fasilitas: Fasilitas[];
  sesi_buka: string[];
}

export interface NearbyCafe {
  id: number;
  nama_cafe: string;
  jarak_km: number;
  latitude: number;
  longitude: number;
  kecamatan: string | null;
}

export interface SearchResult {
  id: number;
  nama_cafe: string;
  slug: string;
  kecamatan: string | null;
  alamat: string;
}

// === Auth Types ===

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expires_in: number;
}

// === Admin Types ===

export interface DashboardStats {
  total_cafe: number;
  cafe_aktif: number;
  cafe_tidak_lengkap: number;
  cafe_per_kecamatan: { nama_kecamatan: string; total: number }[];
  rata_rata_completeness: number;
}

export interface CreateCafeRequest {
  nama_cafe: string;
  lokasi_id: number;
  alamat?: string;
  latitude?: number;
  longitude?: number;
  no_telepon?: string;
  harga_min?: number;
  harga_max?: number;
  deskripsi?: string;
  sesi_buka?: string;
  kategori_ids?: number[];
  fasilitas_ids?: number[];
  jam_buka?: JamBukaInput[];
}

export interface JamBukaInput {
  hari: string;
  jam_buka?: string;
  jam_tutup?: string;
  is_tutup?: boolean;
}

export interface UpdateCafeRequest extends Partial<CreateCafeRequest> {}

// === Filter Types ===

export interface CafeFilters {
  lokasi_id?: number;
  harga_max?: number;
  sesi_buka?: string;
  kategori_id?: number;
  fasilitas_ids?: string; // comma-separated IDs
  page?: number;
  limit?: number;
}
