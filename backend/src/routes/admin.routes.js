const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cafeController = require('../controllers/cafeController');
const fotoController = require('../controllers/fotoController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// All admin routes are protected
router.use(authMiddleware);

// Dashboard
router.get('/dashboard/stats', cafeController.getDashboardStats);

// Cafe CRUD
router.post('/cafes', cafeController.createCafe);
router.get('/cafes/:id', cafeController.getCafeById);
router.put('/cafes/:id', cafeController.updateCafe);
router.delete('/cafes/:id', cafeController.deleteCafe);

// Kategori (M:N)
router.put('/cafes/:id/kategori', cafeController.setKategori);

// Fasilitas (M:N)
router.put('/cafes/:id/fasilitas', cafeController.setFasilitas);

// Jam Buka
router.put('/cafes/:id/jam-buka', cafeController.setJamBuka);

// Foto
router.post('/cafes/:id/fotos', uploadMiddleware.single('foto'), fotoController.uploadFoto);
router.delete('/fotos/:foto_id', fotoController.deleteFoto);
router.put('/cafes/:id/fotos/reorder', fotoController.reorderFotos);

module.exports = router;
