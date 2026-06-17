const cafeService = require('../services/cafeService');

class CafeController {
  // ===== PUBLIC ENDPOINTS =====

  // GET /v1/cafes
  async getAllCafes(req, res, next) {
    try {
      const result = await cafeService.getAllCafes(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/cafes/search
  async searchCafes(req, res, next) {
    try {
      const { q, limit } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Query parameter "q" wajib diisi' });
      }
      const data = await cafeService.searchCafes(q, limit);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/cafes/nearby
  async getNearbyCafes(req, res, next) {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ message: 'Parameter "lat" dan "lng" wajib diisi' });
      }
      const data = await cafeService.getNearbyCafes(lat, lng, radius);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/cafes/filters/options
  async getFilterOptions(req, res, next) {
    try {
      const options = await cafeService.getFilterOptions();
      res.json(options);
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/cafes/:slug
  async getCafeBySlug(req, res, next) {
    try {
      const cafe = await cafeService.getCafeBySlug(req.params.slug);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // ===== MASTER DATA (PUBLIC) =====

  // GET /v1/lokasi
  async getAllLokasi(req, res, next) {
    try {
      const data = await cafeService.getAllLokasi();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/kategori
  async getAllKategori(req, res, next) {
    try {
      const data = await cafeService.getAllKategori();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/fasilitas
  async getAllFasilitas(req, res, next) {
    try {
      const data = await cafeService.getAllFasilitas();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // ===== ADMIN ENDPOINTS =====

  // POST /v1/admin/cafes
  async createCafe(req, res, next) {
    try {
      req.body.admin_id = req.admin?.id || null;
      const cafe = await cafeService.createCafe(req.body);
      res.status(201).json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // PUT /v1/admin/cafes/:id
  async updateCafe(req, res, next) {
    try {
      const cafe = await cafeService.updateCafe(req.params.id, req.body);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /v1/admin/cafes/:id
  async deleteCafe(req, res, next) {
    try {
      const cafe = await cafeService.deleteCafe(req.params.id);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json({ message: 'Cafe berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }

  // PUT /v1/admin/cafes/:id/kategori
  async setKategori(req, res, next) {
    try {
      const { kategori_ids } = req.body;
      if (!kategori_ids || !Array.isArray(kategori_ids)) {
        return res.status(400).json({ message: 'Field "kategori_ids" wajib berupa array' });
      }
      const cafe = await cafeService.setKategori(req.params.id, kategori_ids);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // PUT /v1/admin/cafes/:id/fasilitas
  async setFasilitas(req, res, next) {
    try {
      const { fasilitas_ids } = req.body;
      if (!fasilitas_ids || !Array.isArray(fasilitas_ids)) {
        return res.status(400).json({ message: 'Field "fasilitas_ids" wajib berupa array' });
      }
      const cafe = await cafeService.setFasilitas(req.params.id, fasilitas_ids);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // PUT /v1/admin/cafes/:id/jam-buka
  async setJamBuka(req, res, next) {
    try {
      const { jam_buka } = req.body;
      if (!jam_buka || !Array.isArray(jam_buka)) {
        return res.status(400).json({ message: 'Field "jam_buka" wajib berupa array' });
      }
      const cafe = await cafeService.setJamBuka(req.params.id, jam_buka);
      if (!cafe) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/admin/dashboard/stats
  async getDashboardStats(req, res, next) {
    try {
      const stats = await cafeService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  // GET /v1/admin/cafes/:id
  async getCafeById(req, res, next) {
    try {
      const cafe = await cafeService.getCafeBySlug(req.params.slug);
      // Try by slug first, then by id
      let result = cafe;
      if (!result) {
        const cafeRepo = require('../repositories/cafeRepository');
        result = await cafeRepo.findById(req.params.id || req.params.slug);
      }
      if (!result) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CafeController();
