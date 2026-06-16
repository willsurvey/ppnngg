const { Op } = require('sequelize');
const { Cafe, Fasilitas, FotoCafe } = require('../models');

class CafeRepository {
  async findAll({ where = {}, include = [], page = 1, limit = 10, order = [['created_at', 'DESC']] }) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Cafe.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      total_pages: Math.ceil(count / limit)
    };
  }

  async findBySlug(slug) {
    return Cafe.findOne({
      where: { slug, is_active: true },
      include: [
        { model: Fasilitas, as: 'fasilitas' },
        { model: FotoCafe, as: 'fotos', separate: true, order: [['urutan', 'ASC']] }
      ]
    });
  }

  async findById(id) {
    return Cafe.findByPk(id, {
      include: [
        { model: Fasilitas, as: 'fasilitas' },
        { model: FotoCafe, as: 'fotos', separate: true, order: [['urutan', 'ASC']] }
      ]
    });
  }

  async create(data) {
    return Cafe.create(data);
  }

  async update(id, data) {
    const cafe = await Cafe.findByPk(id);
    if (!cafe) return null;
    await cafe.update(data);
    return cafe;
  }

  async softDelete(id) {
    const cafe = await Cafe.findByPk(id);
    if (!cafe) return null;
    await cafe.update({ is_active: false });
    return cafe;
  }

  async search(query, limit = 5) {
    return Cafe.findAll({
      where: {
        is_active: true,
        [Op.or]: [
          { nama: { [Op.like]: `%${query}%` } },
          { alamat: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'nama', 'slug', 'kecamatan', 'alamat'],
      limit
    });
  }

  async findActiveCafes() {
    return Cafe.findAll({
      where: { is_active: true },
      attributes: ['id', 'nama', 'latitude', 'longitude', 'kecamatan']
    });
  }

  async getFilterOptions() {
    // Get distinct kecamatan values
    const cafes = await Cafe.findAll({
      where: { is_active: true },
      attributes: ['kecamatan', 'suasana', 'sesi_buka'],
      raw: true
    });

    const kecamatan = [...new Set(cafes.map(c => c.kecamatan).filter(Boolean))].sort();
    const suasana = [...new Set(cafes.map(c => c.suasana).filter(Boolean))].sort();

    return {
      kecamatan,
      suasana,
      sesi_buka: ['pagi', 'siang', 'sore', 'malam', '24jam']
    };
  }

  async getDashboardStats() {
    const totalCafe = await Cafe.count();
    const cafeAktif = await Cafe.count({ where: { is_active: true } });
    const cafeTidakLengkap = await Cafe.count({
      where: { is_active: true, completeness_pct: { [Op.lt]: 100 } }
    });

    // Cafe per kecamatan
    const { sequelize } = require('../config/database');
    const [cafePerKecamatan] = await sequelize.query(`
      SELECT kecamatan, COUNT(*) as total 
      FROM tbl_cafe 
      WHERE is_active = true AND kecamatan IS NOT NULL
      GROUP BY kecamatan 
      ORDER BY total DESC
    `);

    // Average completeness
    const [avgResult] = await sequelize.query(`
      SELECT AVG(completeness_pct) as rata_rata 
      FROM tbl_cafe 
      WHERE is_active = true
    `);

    return {
      total_cafe: totalCafe,
      cafe_aktif: cafeAktif,
      cafe_tidak_lengkap: cafeTidakLengkap,
      cafe_per_kecamatan: cafePerKecamatan,
      rata_rata_completeness: Math.round(avgResult[0]?.rata_rata || 0)
    };
  }

  // Fasilitas methods
  async upsertFasilitas(cafeId, data) {
    const existing = await Fasilitas.findOne({ where: { cafe_id: cafeId } });
    if (existing) {
      await existing.update(data);
      return existing;
    }
    return Fasilitas.create({ cafe_id: cafeId, ...data });
  }

  async getFasilitasByCafeId(cafeId) {
    return Fasilitas.findOne({ where: { cafe_id: cafeId } });
  }

  // Foto methods
  async addFoto(data) {
    return FotoCafe.create(data);
  }

  async deleteFoto(fotoId) {
    const foto = await FotoCafe.findByPk(fotoId);
    if (!foto) return null;
    await foto.destroy();
    return foto;
  }

  async getFotoByCafeId(cafeId) {
    return FotoCafe.findAll({
      where: { cafe_id: cafeId },
      order: [['urutan', 'ASC']]
    });
  }

  async getFotoCount(cafeId) {
    return FotoCafe.count({ where: { cafe_id: cafeId } });
  }

  async reorderFotos(cafeId, urutanIds) {
    const transaction = await FotoCafe.sequelize.transaction();
    try {
      for (let i = 0; i < urutanIds.length; i++) {
        await FotoCafe.update(
          { urutan: i + 1 },
          { where: { id: urutanIds[i], cafe_id: cafeId }, transaction }
        );
      }
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = new CafeRepository();
