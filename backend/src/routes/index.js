const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const cafeRoutes = require('./cafe.routes');
const adminRoutes = require('./admin.routes');
const cafeController = require('../controllers/cafeController');

// Public routes
router.use('/auth', authRoutes);
router.use('/cafes', cafeRoutes);
router.use('/admin', adminRoutes);

/**
 * @swagger
 * /lokasi:
 *   get:
 *     tags: [Master Data]
 *     summary: Daftar semua lokasi (kecamatan)
 *     responses:
 *       200:
 *         description: Daftar lokasi kecamatan
 */
router.get('/lokasi', cafeController.getAllLokasi);

/**
 * @swagger
 * /kategori:
 *   get:
 *     tags: [Master Data]
 *     summary: Daftar semua kategori (suasana)
 *     responses:
 *       200:
 *         description: Daftar kategori/suasana
 */
router.get('/kategori', cafeController.getAllKategori);

/**
 * @swagger
 * /fasilitas:
 *   get:
 *     tags: [Master Data]
 *     summary: Daftar semua fasilitas
 *     responses:
 *       200:
 *         description: Daftar fasilitas
 */
router.get('/fasilitas', cafeController.getAllFasilitas);

module.exports = router;
