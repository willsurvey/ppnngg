const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cafeController = require('../controllers/cafeController');
const fotoController = require('../controllers/fotoController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const {
  createCafeValidation,
  updateCafeValidation,
  setKategoriValidation,
  setFasilitasValidation,
  setJamBukaValidation,
  uploadFotoValidation,
  deleteFotoValidation,
  reorderFotoValidation
} = require('../middlewares/validation');

// All admin routes are protected
router.use(authMiddleware);

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Statistik dashboard admin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik total cafe, per kecamatan, dll
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard/stats', cafeController.getDashboardStats);

/**
 * @swagger
 * /admin/cafes:
 *   post:
 *     tags: [Admin Cafe]
 *     summary: Tambah cafe baru
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nama_cafe, lokasi_id]
 *             properties:
 *               nama_cafe: { type: string }
 *               lokasi_id: { type: integer }
 *               alamat: { type: string }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               no_telepon: { type: string }
 *               harga_min: { type: integer }
 *               harga_max: { type: integer }
 *               deskripsi: { type: string }
 *               sesi_buka: { type: string, enum: [pagi, siang, malam] }
 *               kategori_ids: { type: array, items: { type: integer } }
 *               fasilitas_ids: { type: array, items: { type: integer } }
 *     responses:
 *       201:
 *         description: Cafe berhasil ditambahkan
 *       400:
 *         description: Validasi gagal
 */
router.post('/cafes', createCafeValidation, cafeController.createCafe);

/**
 * @swagger
 * /admin/cafes/{id}:
 *   get:
 *     tags: [Admin Cafe]
 *     summary: Detail cafe by ID (admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Detail lengkap cafe
 *       404:
 *         description: Cafe tidak ditemukan
 */
router.get('/cafes/:id', cafeController.getCafeById);

/**
 * @swagger
 * /admin/cafes/{id}:
 *   put:
 *     tags: [Admin Cafe]
 *     summary: Update cafe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_cafe: { type: string }
 *               lokasi_id: { type: integer }
 *               alamat: { type: string }
 *               latitude: { type: number, nullable: true }
 *               longitude: { type: number, nullable: true }
 *               no_telepon: { type: string, nullable: true }
 *               harga_min: { type: integer, nullable: true }
 *               harga_max: { type: integer, nullable: true }
 *               deskripsi: { type: string, nullable: true }
 *               sesi_buka: { type: string, enum: [pagi, siang, malam], nullable: true }
 *     responses:
 *       200:
 *         description: Cafe berhasil diupdate
 *       404:
 *         description: Cafe tidak ditemukan
 */
router.put('/cafes/:id', updateCafeValidation, cafeController.updateCafe);

/**
 * @swagger
 * /admin/cafes/{id}:
 *   delete:
 *     tags: [Admin Cafe]
 *     summary: Hapus cafe (soft delete)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Cafe berhasil dihapus
 *       404:
 *         description: Cafe tidak ditemukan
 */
router.delete('/cafes/:id', cafeController.deleteCafe);

/**
 * @swagger
 * /admin/cafes/{id}/kategori:
 *   put:
 *     tags: [Admin Cafe]
 *     summary: Set kategori cafe (M:N)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [kategori_ids]
 *             properties:
 *               kategori_ids:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 */
router.put('/cafes/:id/kategori', setKategoriValidation, cafeController.setKategori);

/**
 * @swagger
 * /admin/cafes/{id}/fasilitas:
 *   put:
 *     tags: [Admin Cafe]
 *     summary: Set fasilitas cafe (M:N)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fasilitas_ids]
 *             properties:
 *               fasilitas_ids:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 3, 5]
 *     responses:
 *       200:
 *         description: Fasilitas berhasil diupdate
 */
router.put('/cafes/:id/fasilitas', setFasilitasValidation, cafeController.setFasilitas);

/**
 * @swagger
 * /admin/cafes/{id}/jam-buka:
 *   put:
 *     tags: [Admin Cafe]
 *     summary: Set jam buka per hari
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jam_buka]
 *             properties:
 *               jam_buka:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     hari: { type: string, enum: [senin, selasa, rabu, kamis, jumat, sabtu, minggu] }
 *                     jam_buka: { type: string, example: "08:00" }
 *                     jam_tutup: { type: string, example: "22:00" }
 *                     is_tutup: { type: boolean }
 *     responses:
 *       200:
 *         description: Jam buka berhasil diupdate
 */
router.put('/cafes/:id/jam-buka', setJamBukaValidation, cafeController.setJamBuka);

/**
 * @swagger
 * /admin/cafes/{id}/fotos:
 *   post:
 *     tags: [Admin Foto]
 *     summary: Upload foto cafe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [foto]
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *               caption: { type: string }
 *               urutan: { type: integer }
 *     responses:
 *       201:
 *         description: Foto berhasil diupload
 *       400:
 *         description: Validasi gagal / file terlalu besar
 */
router.post('/cafes/:id/fotos', uploadMiddleware.single('foto'), uploadFotoValidation, fotoController.uploadFoto);

/**
 * @swagger
 * /admin/fotos/{foto_id}:
 *   delete:
 *     tags: [Admin Foto]
 *     summary: Hapus foto
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foto_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Foto berhasil dihapus
 *       404:
 *         description: Foto tidak ditemukan
 */
router.delete('/fotos/:foto_id', deleteFotoValidation, fotoController.deleteFoto);

/**
 * @swagger
 * /admin/cafes/{id}/fotos/reorder:
 *   put:
 *     tags: [Admin Foto]
 *     summary: Ubah urutan foto
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [urutan]
 *             properties:
 *               urutan:
 *                 type: array
 *                 items: { type: integer }
 *                 description: Array ID foto dalam urutan baru
 *                 example: [3, 1, 2]
 *     responses:
 *       200:
 *         description: Urutan foto berhasil diupdate
 */
router.put('/cafes/:id/fotos/reorder', reorderFotoValidation, fotoController.reorderFotos);

module.exports = router;
