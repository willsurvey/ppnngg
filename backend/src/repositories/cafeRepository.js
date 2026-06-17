const { Op } = require('sequelize');
const {
  Cafe, Lokasi, Kategori, Fasilitas, JamBuka,
  CafeKategori, CafeFasilitas, FotoCafe, Admin
} = require('../models');

class CafeRepository {
  // ===== CAFE CRUD =====

  async findAll({ where = {}, include = [], page = 1, limit = 10, order = [['created_at', 'DESC']] }) {
    const offset = (page - 1) * limit;

    // Default includes for list view
    if (include.length === 0) {
      include = [
        { model: Lokasi, as: 'lokasi', attributes: ['id', 'nama_kecamatan'] },
        { model: Kategori, as: 'kategori', attributes: ['id', 'nama_kategori'], through: { attributes: [] } },
        { model: Fasilitas, as: 'fasilitas', attributes: ['id', 'nama_fasilitas', 'icon'], through: { attributes: [] } },
        { model: FotoCafe, as: 'fotos', separate: true, limit: 1, order: [['urutan', 'ASC']] }
      ];
    }

    const { rows, count } = await Cafe.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order,
      distinct: true
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
        { model: Lokasi, as: 'lokasi' },
        { model: Kategori, as: 'kategori', attributes: ['id', 'nama_kategori'], through: { attributes: [] } },
        { model: Fasilitas, as: 'fasilitas', attributes: ['id', 'nama_fasilitas', 'icon'], through: { attributes: [] } },
        { model: JamBuka, as: 'jam_buka', order: [['hari', 'ASC']] },
        { model: FotoCafe, as: 'fotos', separate: true, order: [['urutan', 'ASC']] }
      ]
    });
  }

  async findById(id) {
    return Cafe.findByPk(id, {
      include: [
        { model: Lokasi, as: 'lokasi' },
        { model: Kategori, as: 'kategori', attributes: ['id', 'nama_kategori'], through: { attributes: [] } },
        { model: Fasilitas, as: 'fasilitas', attributes: ['id', 'nama_fasilitas', 'icon'], through: { attributes: [] } },
        { model: JamBuka, as: 'jam_buka', order: [['hari', 'ASC']] },
        { model: FotoCafe, as: 'fotos', separate: true, order: [['urutan', 'ASC']] }
      ]
    });
  }

  async findByIdSimple(id) {
    return Cafe.findByPk(id);
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
    await cafe.destroy(); // paranoid: true sets deleted_at
    return cafe;
  }

  // ===== SEARCH =====

  async search(query, limit = 5) {
    return Cafe.findAll({
      where: {
        is_active: true,
        [Op.or]: [
          { nama_cafe: { [Op.like]: `%${query}%` } },
          { alamat: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'nama_cafe', 'slug', 'alamat'],
      include: [
        { model: Lokasi, as: 'lokasi', attributes: ['nama_kecamatan'] }
      ],
      limit
    });
  }

  // ===== NEARBY =====

  async findActiveCafes() {
    return Cafe.findAll({
      where: { is_active: true },
      attributes: ['id', 'nama_cafe', 'latitude', 'longitude'],
      include: [
        { model: Lokasi, as: 'lokasi', attributes: ['nama_kecamatan'] }
      ]
    });
  }

  // ===== FILTER =====

  async findWithFilters(query) {
    const {
      lokasi_id, harga_max, sesi_buka, kategori_id,
      fasilitas_ids,
      page = 1, limit = 10
    } = query;

    const where = { is_active: true };
    if (lokasi_id) where.lokasi_id = lokasi_id;
    if (harga_max) where.harga_min = { [Op.lte]: parseInt(harga_max, 10) };
    if (sesi_buka) where.sesi_buka = sesi_buka;

    const include = [
      { model: Lokasi, as: 'lokasi', attributes: ['id', 'nama_kecamatan'] },
      { model: Kategori, as: 'kategori', attributes: ['id', 'nama_kategori'], through: { attributes: [] } },
      { model: Fasilitas, as: 'fasilitas', attributes: ['id', 'nama_fasilitas', 'icon'], through: { attributes: [] } },
      { model: FotoCafe, as: 'fotos', separate: true, limit: 1, order: [['urutan', 'ASC']] }
    ];

    // Filter by kategori (M:N)
    if (kategori_id) {
      include[1].where = { id: kategori_id };
      include[1].required = true;
    }

    // Filter by fasilitas (M:N)
    if (fasilitas_ids && fasilitas_ids.length > 0) {
      include[2].where = { id: { [Op.in]: fasilitas_ids } };
      include[2].required = true;
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const { rows, count } = await Cafe.findAndCountAll({
      where,
      include,
      limit: parseInt(limit, 10),
      offset,
      order: [['created_at', 'DESC']],
      distinct: true
    });

    return {
      data: rows,
      total: count,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total_pages: Math.ceil(count / parseInt(limit, 10))
    };
  }

  // ===== FILTER OPTIONS =====

  async getFilterOptions() {
    const lokasi = await Lokasi.findAll({
      attributes: ['id', 'nama_kecamatan'],
      order: [['nama_kecamatan', 'ASC']]
    });

    const kategori = await Kategori.findAll({
      attributes: ['id', 'nama_kategori'],
      order: [['nama_kategori', 'ASC']]
    });

    const fasilitas = await Fasilitas.findAll({
      attributes: ['id', 'nama_fasilitas'],
      order: [['nama_fasilitas', 'ASC']]
    });

    return {
      lokasi,
      kategori,
      fasilitas,
      sesi_buka: ['pagi', 'siang', 'malam']
    };
  }

  // ===== DASHBOARD STATS =====

  async getDashboardStats() {
    const totalCafe = await Cafe.count();
    const cafeAktif = await Cafe.count({ where: { is_active: true } });
    const cafeTidakLengkap = await Cafe.count({
      where: { is_active: true, completeness_score: { [Op.lt]: 100 } }
    });

    const sequelize = require('../config/database');

    // Cafe per lokasi (kecamatan)
    const [cafePerLokasi] = await sequelize.query(`
      SELECT l.nama_kecamatan, COUNT(c.id) as total 
      FROM cafe c
      JOIN lokasi l ON c.lokasi_id = l.id
      WHERE c.is_active = true AND c.deleted_at IS NULL
      GROUP BY l.id, l.nama_kecamatan
      ORDER BY total DESC
    `);

    // Average completeness
    const [avgResult] = await sequelize.query(`
      SELECT AVG(completeness_score) as rata_rata 
      FROM cafe 
      WHERE is_active = true AND deleted_at IS NULL
    `);

    return {
      total_cafe: totalCafe,
      cafe_aktif: cafeAktif,
      cafe_tidak_lengkap: cafeTidakLengkap,
      cafe_per_kecamatan: cafePerLokasi,
      rata_rata_completeness: Math.round(avgResult[0]?.rata_rata || 0)
    };
  }

  // ===== KATEGORI (M:N) =====

  async setCafeKategori(cafeId, kategoriIds) {
    const transaction = await Cafe.sequelize.transaction();
    try {
      // Remove existing
      await CafeKategori.destroy({ where: { cafe_id: cafeId }, transaction });
      // Insert new
      if (kategoriIds && kategoriIds.length > 0) {
        const records = kategoriIds.map(kid => ({
          cafe_id: cafeId,
          kategori_id: kid
        }));
        await CafeKategori.bulkCreate(records, { transaction });
      }
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ===== FASILITAS (M:N) =====

  async setCafeFasilitas(cafeId, fasilitasIds) {
    const transaction = await Cafe.sequelize.transaction();
    try {
      // Remove existing
      await CafeFasilitas.destroy({ where: { cafe_id: cafeId }, transaction });
      // Insert new
      if (fasilitasIds && fasilitasIds.length > 0) {
        const records = fasilitasIds.map(fid => ({
          cafe_id: cafeId,
          fasilitas_id: fid
        }));
        await CafeFasilitas.bulkCreate(records, { transaction });
      }
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ===== JAM BUKA =====

  async setJamBuka(cafeId, jamBukaList) {
    const transaction = await Cafe.sequelize.transaction();
    try {
      // Remove existing
      await JamBuka.destroy({ where: { cafe_id: cafeId }, transaction });
      // Insert new
      if (jamBukaList && jamBukaList.length > 0) {
        const records = jamBukaList.map(jb => ({
          cafe_id: cafeId,
          hari: jb.hari,
          jam_buka: jb.jam_buka || null,
          jam_tutup: jb.jam_tutup || null,
          is_tutup: jb.is_tutup || false
        }));
        await JamBuka.bulkCreate(records, { transaction });
      }
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getJamBukaByCafeId(cafeId) {
    return JamBuka.findAll({
      where: { cafe_id: cafeId },
      order: [['hari', 'ASC']]
    });
  }

  // ===== FOTO =====

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

  // ===== MASTER DATA =====

  async getAllLokasi() {
    return Lokasi.findAll({ order: [['nama_kecamatan', 'ASC']] });
  }

  async getAllKategori() {
    return Kategori.findAll({ order: [['nama_kategori', 'ASC']] });
  }

  async getAllFasilitas() {
    return Fasilitas.findAll({ order: [['nama_fasilitas', 'ASC']] });
  }
}

module.exports = new CafeRepository();
