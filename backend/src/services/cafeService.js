const { Op } = require('sequelize');
const slugify = require('slugify');
const cafeRepository = require('../repositories/cafeRepository');
const { calculateCompleteness } = require('../utils/completeness');
const { haversineDistance } = require('../utils/haversine');
const { Fasilitas, FotoCafe } = require('../models');

class CafeService {
  async getAllCafes(query) {
    const {
      kecamatan, harga_max, sesi_buka, suasana,
      ac, wifi, mushola, toilet, parkir, ruang_rapat, colokan,
      page = 1, limit = 10
    } = query;

    const where = { is_active: true };
    if (kecamatan) where.kecamatan = kecamatan;
    if (harga_max) where.harga_min = { [Op.lte]: parseInt(harga_max, 10) };
    if (sesi_buka) where.sesi_buka = sesi_buka;
    if (suasana) where.suasana = { [Op.like]: `%${suasana}%` };

    // Build fasilitas filter
    const fasilitasFilter = {};
    let needsFasilitasJoin = false;
    const fasilitasFields = { ac, wifi, mushola, toilet, parkir, ruang_rapat, colokan };
    for (const [key, value] of Object.entries(fasilitasFields)) {
      if (value === 'true') {
        fasilitasFilter[key] = true;
        needsFasilitasJoin = true;
      }
    }

    const include = [];
    if (needsFasilitasJoin) {
      include.push({
        model: Fasilitas,
        as: 'fasilitas',
        where: Object.keys(fasilitasFilter).length > 0 ? fasilitasFilter : undefined,
        required: true
      });
    } else {
      include.push({ model: Fasilitas, as: 'fasilitas' });
    }

    const result = await cafeRepository.findAll({
      where,
      include,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    // Format response: add thumbnail from first foto
    const formattedData = result.data.map(cafe => {
      const cafeJson = cafe.toJSON();
      return {
        id: cafeJson.id,
        nama: cafeJson.nama,
        slug: cafeJson.slug,
        alamat: cafeJson.alamat,
        kecamatan: cafeJson.kecamatan,
        harga_min: cafeJson.harga_min,
        harga_max: cafeJson.harga_max,
        sesi_buka: cafeJson.sesi_buka,
        suasana: cafeJson.suasana,
        thumbnail: cafeJson.fotos && cafeJson.fotos.length > 0
          ? cafeJson.fotos[0].url_foto : null,
        fasilitas: cafeJson.fasilitas ? {
          ac: cafeJson.fasilitas.ac,
          wifi: cafeJson.fasilitas.wifi,
          toilet: cafeJson.fasilitas.toilet,
          mushola: cafeJson.fasilitas.mushola,
          ruang_rapat: cafeJson.fasilitas.ruang_rapat,
          parkir: cafeJson.fasilitas.parkir,
          colokan: cafeJson.fasilitas.colokan
        } : null,
        completeness_pct: cafeJson.completeness_pct
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

  async getCafeBySlug(slug) {
    const cafe = await cafeRepository.findBySlug(slug);
    if (!cafe) return null;

    const cafeJson = cafe.toJSON();
    return {
      ...cafeJson,
      fasilitas: cafeJson.fasilitas ? {
        ac: cafeJson.fasilitas.ac,
        wifi: cafeJson.fasilitas.wifi,
        toilet: cafeJson.fasilitas.toilet,
        mushola: cafeJson.fasilitas.mushola,
        ruang_rapat: cafeJson.fasilitas.ruang_rapat,
        parkir: cafeJson.fasilitas.parkir,
        colokan: cafeJson.fasilitas.colokan
      } : null,
      fotos: cafeJson.fotos || []
    };
  }

  async searchCafes(query, limit) {
    return cafeRepository.search(query, parseInt(limit, 10) || 5);
  }

  async getNearbyCafes(lat, lng, radius = 3) {
    const cafes = await cafeRepository.findActiveCafes();
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    const results = cafes
      .filter(cafe => cafe.latitude != null && cafe.longitude != null)
      .map(cafe => {
        const cafeLat = parseFloat(cafe.latitude);
        const cafeLng = parseFloat(cafe.longitude);
        const jarak = haversineDistance(userLat, userLng, cafeLat, cafeLng);
        return {
          id: cafe.id,
          nama: cafe.nama,
          jarak_km: Math.round(jarak * 100) / 100,
          latitude: cafeLat,
          longitude: cafeLng
        };
      })
      .filter(cafe => cafe.jarak_km <= parseFloat(radius))
      .sort((a, b) => a.jarak_km - b.jarak_km);

    return results;
  }

  async getFilterOptions() {
    return cafeRepository.getFilterOptions();
  }

  async createCafe(data) {
    // Auto-generate slug from nama
    if (!data.slug) {
      data.slug = slugify(data.nama, { lower: true, strict: true });
    }

    const cafe = await cafeRepository.create(data);

    // Create empty fasilitas record
    await cafeRepository.upsertFasilitas(cafe.id, {});

    // Calculate completeness
    await this.recalculateCompleteness(cafe.id);

    return cafeRepository.findById(cafe.id);
  }

  async updateCafe(id, data) {
    // Regenerate slug if nama changes
    if (data.nama && !data.slug) {
      data.slug = slugify(data.nama, { lower: true, strict: true });
    }

    const cafe = await cafeRepository.update(id, data);
    if (!cafe) return null;

    // Recalculate completeness
    await this.recalculateCompleteness(id);

    return cafeRepository.findById(id);
  }

  async deleteCafe(id) {
    return cafeRepository.softDelete(id);
  }

  async updateFasilitas(cafeId, data) {
    const cafe = await cafeRepository.findById(cafeId);
    if (!cafe) return null;

    const fasilitas = await cafeRepository.upsertFasilitas(cafeId, data);

    // Recalculate completeness
    await this.recalculateCompleteness(cafeId);

    return fasilitas;
  }

  async getDashboardStats() {
    return cafeRepository.getDashboardStats();
  }

  async recalculateCompleteness(cafeId) {
    const cafe = await cafeRepository.findById(cafeId);
    if (!cafe) return;

    const cafeData = cafe.toJSON();
    const fasilitas = cafeData.fasilitas || null;
    const fotoCount = cafeData.fotos ? cafeData.fotos.length : 0;

    const score = calculateCompleteness(cafeData, fasilitas, fotoCount);
    await cafeRepository.update(cafeId, { completeness_pct: score });
  }
}

module.exports = new CafeService();
