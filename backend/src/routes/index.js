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

// Master data (public)
router.get('/lokasi', cafeController.getAllLokasi);
router.get('/kategori', cafeController.getAllKategori);
router.get('/fasilitas', cafeController.getAllFasilitas);

module.exports = router;
