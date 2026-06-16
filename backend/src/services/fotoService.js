const cafeRepository = require('../repositories/cafeRepository');
const cafeService = require('./cafeService');
const fs = require('fs');
const path = require('path');

class FotoService {
  async uploadFoto(cafeId, file, caption, urutan) {
    const cafe = await cafeRepository.findById(cafeId);
    if (!cafe) {
      // Clean up uploaded file if cafe not found
      if (file && file.path) fs.unlinkSync(file.path);
      return null;
    }

    // Build URL based on server config
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`;
    const urlFoto = `${baseUrl}/uploads/${file.filename}`;

    // Auto-determine urutan if not provided
    let fotoUrutan = parseInt(urutan, 10);
    if (!fotoUrutan || isNaN(fotoUrutan)) {
      const existingFotos = await cafeRepository.getFotoByCafeId(cafeId);
      fotoUrutan = existingFotos.length + 1;
    }

    const foto = await cafeRepository.addFoto({
      cafe_id: cafeId,
      url_foto: urlFoto,
      urutan: fotoUrutan,
      caption: caption || null
    });

    // Recalculate completeness
    await cafeService.recalculateCompleteness(cafeId);

    return foto;
  }

  async deleteFoto(fotoId) {
    const foto = await cafeRepository.deleteFoto(fotoId);
    if (!foto) return null;

    // Delete physical file
    if (foto.url_foto) {
      const filename = foto.url_foto.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Recalculate completeness
    await cafeService.recalculateCompleteness(foto.cafe_id);

    return foto;
  }

  async reorderFotos(cafeId, urutan) {
    const cafe = await cafeRepository.findById(cafeId);
    if (!cafe) return null;

    await cafeRepository.reorderFotos(cafeId, urutan);
    return true;
  }
}

module.exports = new FotoService();
