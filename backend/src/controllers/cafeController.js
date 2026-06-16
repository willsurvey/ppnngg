const cafeService = require('../services/cafeService');

class CafeController {
  // === PUBLIC ENDPOINTS ===

  // GET /cafes - endpoint #3
  async getAllCafes(req, res, next) {
    try {
      const result = await cafeService.getAllCafes(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // GET /cafes/search - endpoint #4
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

  // GET /cafes/nearby - endpoint #5
  async getNearbyCafes(req, res, next) {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({
          message: 'Parameter "lat" dan "lng" wajib diisi'
        });
      }
      const data = await cafeService.getNearbyCafes(lat, lng, radius);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  // GET /cafes/filters/options - endpoint #6
  async getFilterOptions(req, res, next) {
    try {
      const options = await cafeService.getFilterOptions();
      res.json(options);
    } catch (error) {
      next(error);
    }
  }

  // GET /cafes/:slug - endpoint #7
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

  // === ADMIN ENDPOINTS ===

  // POST /admin/cafes - endpoint #8
  async createCafe(req, res, next) {
    try {
      const cafe = await cafeService.createCafe(req.body);
      res.status(201).json(cafe);
    } catch (error) {
      next(error);
    }
  }

  // PUT /admin/cafes/:id - endpoint #9
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

  // DELETE /admin/cafes/:id - endpoint #10
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

  // PUT /admin/cafes/:id/fasilitas - endpoint #11
  async updateFasilitas(req, res, next) {
    try {
      const fasilitas = await cafeService.updateFasilitas(req.params.id, req.body);
      if (!fasilitas) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }
      res.json(fasilitas);
    } catch (error) {
      next(error);
    }
  }

  // GET /admin/dashboard/stats - endpoint #15
  async getDashboardStats(req, res, next) {
    try {
      const stats = await cafeService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CafeController();
