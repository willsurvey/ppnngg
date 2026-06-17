const slugify = require('slugify');
const cafeRepository = require('../repositories/cafeRepository');
const { calculateCompleteness } = require('../utils/completeness');
const { haversineDistance } = require('../utils/haversine');

class CafeService {
  // ===== LIST CAFES WITH FILTERS =====

  async getAllCafes(query) {
    const result = await cafeRepository.findWithFilters(query);

    const formattedData = result.data.map(cafe => {
      const c = cafe.toJSON();
      return {
        id: c.id,
        nama_cafe: c.nama_cafe,
        slug: c.slug,
        alamat: c.alamat,
        lokasi: c.lokasi ? { id: c.lokasi.id, nama_kecamatan: c.lokasi.nama_kecamatan } : null,
        harga_min: c.harga_min,
        harga_max: c.harga_max,
        sesi_buka: c.sesi_buka,
        thumbnail: c.fotos && c.fotos.length > 0 ? c.fotos[0].url_foto : null,
        kategori: (c.kategori || []).map(k => ({ id: k.id, nama_kategori: k.nama_kategori })),
        fasilitas: (c.fasilitas || []).map(f => ({ id: f.id, nama_fasilitas: f.nama_fasilitas, icon: f.icon })),
        completeness_score: c.completeness_score
      };
    });

    return {
      data: formattedData,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        total_pages: result.total_pages
      }
    };
  }

  // ===== DETAIL BY SLUG =====

  async getCafeBySlug(slug) {
    const cafe = await cafeRepository.findBySlug(slug);
    if (!cafe) return null;

    const c = cafe.toJSON();
    return {
      ...c,
      lokasi: c.lokasi || null,
      kategori: (c.kategori || []).map(k => ({ id: k.id, nama_kategori: k.nama_kategori })),
      fasilitas: (c.fasilitas || []).map(f => ({ id: f.id, nama_fasilitas: f.nama_fasilitas, icon: f.icon })),
      jam_buka: c.jam_buka || [],
      fotos: c.fotos || []
    };
  }

  // ===== SEARCH =====

  async searchCafes(query, limit) {
    const results = await cafeRepository.search(query, parseInt(limit, 10) || 5);
    return results.map(c => {
      const cj = c.toJSON();
      return {
        id: cj.id,
        nama_cafe: cj.nama_cafe,
        slug: cj.slug,
        alamat: cj.alamat,
        kecamatan: cj.lokasi ? cj.lokasi.nama_kecamatan : null
      };
    });
  }

  // ===== NEARBY =====

  async getNearbyCafes(lat, lng, radius = 3) {
    const cafes = await cafeRepository.findActiveCafes();
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    return cafes
      .filter(cafe => cafe.latitude != null && cafe.longitude != null)
      .map(cafe => {
        const cafeLat = parseFloat(cafe.latitude);
        const cafeLng = parseFloat(cafe.longitude);
        const jarak = haversineDistance(userLat, userLng, cafeLat, cafeLng);
        return {
          id: cafe.id,
          nama_cafe: cafe.nama_cafe,
          jarak_km: Math.round(jarak * 100) / 100,
          latitude: cafeLat,
          longitude: cafeLng,
          kecamatan: cafe.lokasi ? cafe.lokasi.nama_kecamatan : null
        };
      })
      .filter(cafe => cafe.jarak_km <= parseFloat(radius))
      .sort((a, b) => a.jarak_km - b.jarak_km);
  }

  // ===== FILTER OPTIONS =====

  async getFilterOptions() {
    return cafeRepository.getFilterOptions();
  }

  // ===== CREATE CAFE =====

  async createCafe(data) {
    // Auto-generate slug
    if (!data.slug) {
      data.slug = this._generateSlug(data.nama_cafe);
    }

    const cafe = await cafeRepository.create(data);

    // Set kategori if provided
    if (data.kategori_ids && data.kategori_ids.length > 0) {
      await cafeRepository.setCafeKategori(cafe.id, data.kategori_ids);
    }

    // Set fasilitas if provided
    if (data.fasilitas_ids && data.fasilitas_ids.length > 0) {
      await cafeRepository.setCafeFasilitas(cafe.id, data.fasilitas_ids);
    }

    // Set jam buka if provided
    if (data.jam_buka && data.jam_buka.length > 0) {
      await cafeRepository.setJamBuka(cafe.id, data.jam_buka);
    }

    // Calculate completeness
    await this.recalculateCompleteness(cafe.id);

    return cafeRepository.findById(cafe.id);
  }

  // ===== UPDATE CAFE =====

  async updateCafe(id, data) {
    const cafe = await cafeRepository.findByIdSimple(id);
    if (!cafe) return null;

    // Regenerate slug if nama changes
    if (data.nama_cafe && data.nama_cafe !== cafe.nama_cafe) {
      data.slug = this._generateSlug(data.nama_cafe);
    }

    await cafeRepository.update(id, data);

    // Update kategori if provided
    if (data.kategori_ids) {
      await cafeRepository.setCafeKategori(id, data.kategori_ids);
    }

    // Update fasilitas if provided
    if (data.fasilitas_ids) {
      await cafeRepository.setCafeFasilitas(id, data.fasilitas_ids);
    }

    // Update jam buka if provided
    if (data.jam_buka) {
      await cafeRepository.setJamBuka(id, data.jam_buka);
    }

    // Recalculate completeness
    await this.recalculateCompleteness(id);

    return cafeRepository.findById(id);
  }

  // ===== DELETE CAFE =====

  async deleteCafe(id) {
    return cafeRepository.softDelete(id);
  }

  // ===== SET KATEGORI =====

  async setKategori(cafeId, kategoriIds) {
    const cafe = await cafeRepository.findByIdSimple(cafeId);
    if (!cafe) return null;
    await cafeRepository.setCafeKategori(cafeId, kategoriIds);
    await this.recalculateCompleteness(cafeId);
    return cafeRepository.findById(cafeId);
  }

  // ===== SET FASILITAS =====

  async setFasilitas(cafeId, fasilitasIds) {
    const cafe = await cafeRepository.findByIdSimple(cafeId);
    if (!cafe) return null;
    await cafeRepository.setCafeFasilitas(cafeId, fasilitasIds);
    await this.recalculateCompleteness(cafeId);
    return cafeRepository.findById(cafeId);
  }

  // ===== SET JAM BUKA =====

  async setJamBuka(cafeId, jamBukaList) {
    const cafe = await cafeRepository.findByIdSimple(cafeId);
    if (!cafe) return null;
    await cafeRepository.setJamBuka(cafeId, jamBukaList);
    await this.recalculateCompleteness(cafeId);
    return cafeRepository.findById(cafeId);
  }

  // ===== DASHBOARD =====

  async getDashboardStats() {
    return cafeRepository.getDashboardStats();
  }

  // ===== RECALCULATE COMPLETENESS =====

  async recalculateCompleteness(cafeId) {
    const cafe = await cafeRepository.findById(cafeId);
    if (!cafe) return;

    const cafeData = cafe.toJSON();
    const kategori = cafeData.kategori || [];
    const fasilitas = cafeData.fasilitas || [];
    const jamBuka = cafeData.jam_buka || [];
    const fotoCount = cafeData.fotos ? cafeData.fotos.length : 0;

    const score = calculateCompleteness(cafeData, kategori, fasilitas, jamBuka, fotoCount);
    await cafeRepository.update(cafeId, { completeness_score: score });
  }

  // ===== MASTER DATA =====

  async getAllLokasi() {
    return cafeRepository.getAllLokasi();
  }

  async getAllKategori() {
    return cafeRepository.getAllKategori();
  }

  async getAllFasilitas() {
    return cafeRepository.getAllFasilitas();
  }

  // ===== HELPERS =====

  _generateSlug(nama) {
    const base = slugify(nama, { lower: true, strict: true });
    const suffix = Date.now().toString(36).slice(-4);
    return `${base}-${suffix}`;
  }
}

module.exports = new CafeService();
