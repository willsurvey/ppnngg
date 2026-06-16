const fotoService = require('../services/fotoService');

class FotoController {
  // POST /admin/cafes/:id/fotos - endpoint #12
  async uploadFoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'File foto wajib diupload' });
      }

      const { caption, urutan } = req.body;
      const cafeId = req.params.id;

      const foto = await fotoService.uploadFoto(cafeId, req.file, caption, urutan);
      if (!foto) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }

      res.status(201).json(foto);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /admin/fotos/:foto_id - endpoint #13
  async deleteFoto(req, res, next) {
    try {
      const foto = await fotoService.deleteFoto(req.params.foto_id);
      if (!foto) {
        return res.status(404).json({ message: 'Foto tidak ditemukan' });
      }
      res.json({ message: 'Foto berhasil dihapus' });
    } catch (error) {
      next(error);
    }
  }

  // PUT /admin/cafes/:id/fotos/reorder - endpoint #14
  async reorderFotos(req, res, next) {
    try {
      const { urutan } = req.body;
      if (!urutan || !Array.isArray(urutan) || urutan.length === 0) {
        return res.status(400).json({
          message: 'Field "urutan" wajib berupa array berisi ID foto'
        });
      }

      const result = await fotoService.reorderFotos(req.params.id, urutan);
      if (!result) {
        return res.status(404).json({ message: 'Cafe tidak ditemukan' });
      }

      res.json({ message: 'Urutan foto berhasil diperbarui' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FotoController();
