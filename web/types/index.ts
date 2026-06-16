// === Core Entities ===

export interface Fasilitas {
  ac: boolean;
  wifi: boolean;
  toilet: boolean;
  mushola: boolean;
  ruang_rapat: boolean;
  parkir: boolean;
  colokan: boolean;
}

export interface FotoCafe {
  id: number;
  url_foto: string;
  urutan: number;
  caption: string | null;
}

export interface Cafe {
  id: number;
  nama: string;
  slug: string;
  alamat: string;
  kecamatan: string;
  harga_min: number;
  harga_max: number;
  sesi_buka: 'pagi' | 'siang' | 'sore' | 'malam' | '24jam';
  suasana: string;
  thumbnail?: string | null;
  fasilitas: Fasilitas | null;
  completeness_pct: number;
}

export interface CafeDetail extends Cafe {
  latitude: number;
  longitude: number;
  jam_buka: string;
  jam_tutup: string;
  buka_24jam: boolean;
  instagram: string;
  google_maps_url: string;
  fotos: FotoCafe[];
}

export interface CafeListItem {
  id: number;
  nama: string;
  slug: string;
  alamat: string;
  kecamatan: string;
  harga_min: number;
  harga_max: number;
  sesi_buka: string;
  suasana: string;
  thumbnail: string | null;
  fasilitas: Fasilitas | null;
  completeness_pct: number;
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
  kecamatan: string[];
  suasana: string[];
  sesi_buka: string[];
}

export interface NearbyCafe {
  id: number;
  nama: string;
  jarak_km: number;
  latitude: number;
  longitude: number;
}

export interface SearchResult {
  id: number;
  nama: string;
  slug: string;
  kecamatan: string;
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
  cafe_per_kecamatan: { kecamatan: string; total: number }[];
  rata_rata_completeness: number;
}

export interface CreateCafeRequest {
  nama: string;
  alamat?: string;
  kecamatan?: string;
  latitude?: number;
  longitude?: number;
  harga_min?: number;
  harga_max?: number;
  jam_buka?: string;
  jam_tutup?: string;
  buka_24jam?: boolean;
  sesi_buka?: string;
  suasana?: string;
  instagram?: string;
  google_maps_url?: string;
}

export interface UpdateCafeRequest extends Partial<CreateCafeRequest> {}

// === Filter Types ===

export interface CafeFilters {
  kecamatan?: string;
  harga_max?: number;
  sesi_buka?: string;
  suasana?: string;
  ac?: boolean;
  wifi?: boolean;
  mushola?: boolean;
  toilet?: boolean;
  parkir?: boolean;
  ruang_rapat?: boolean;
  colokan?: boolean;
  page?: number;
  limit?: number;
}
