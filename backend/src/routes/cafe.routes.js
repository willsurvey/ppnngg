const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');
const { searchValidation, nearbyValidation } = require('../middlewares/validation');

/**
 * @swagger
 * /cafes:
 *   get:
 *     tags: [Cafe Public]
 *     summary: List semua cafe dengan filter & pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: lokasi_id
 *         schema: { type: integer }
 *       - in: query
 *         name: kategori_id
 *         schema: { type: integer }
 *       - in: query
 *         name: fasilitas_ids
 *         schema: { type: string }
 *         description: Comma-separated fasilitas IDs
 *       - in: query
 *         name: harga_max
 *         schema: { type: integer }
 *       - in: query
 *         name: sesi_buka
 *         schema: { type: string, enum: [pagi, siang, malam] }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [terbaru, termahal, termurah, terlengkap] }
 *     responses:
 *       200:
 *         description: Daftar cafe dengan pagination
 */
router.get('/', cafeController.getAllCafes);

/**
 * @swagger
 * /cafes/search:
 *   get:
 *     tags: [Cafe Public]
 *     summary: Cari cafe berdasarkan nama/alamat
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, minLength: 2 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 5 }
 *     responses:
 *       200:
 *         description: Hasil pencarian cafe
 *       400:
 *         description: Query parameter tidak valid
 */
router.get('/search', searchValidation, cafeController.searchCafes);

/**
 * @swagger
 * /cafes/nearby:
 *   get:
 *     tags: [Cafe Public]
 *     summary: Cafe terdekat berdasarkan koordinat
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: lng
 *         required: true
 *         schema: { type: number }
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 5 }
 *         description: Radius dalam km
 *     responses:
 *       200:
 *         description: Daftar cafe terdekat
 *       400:
 *         description: Parameter tidak valid
 */
router.get('/nearby', nearbyValidation, cafeController.getNearbyCafes);

/**
 * @swagger
 * /cafes/filters/options:
 *   get:
 *     tags: [Cafe Public]
 *     summary: Opsi filter untuk dropdown
 *     responses:
 *       200:
 *         description: Daftar opsi filter (lokasi, kategori, fasilitas, sesi)
 */
router.get('/filters/options', cafeController.getFilterOptions);

/**
 * @swagger
 * /cafes/{slug}:
 *   get:
 *     tags: [Cafe Public]
 *     summary: Detail cafe berdasarkan slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Detail lengkap cafe
 *       404:
 *         description: Cafe tidak ditemukan
 */
router.get('/:slug', cafeController.getCafeBySlug);

module.exports = router;
