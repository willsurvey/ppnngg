const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const cafeRoutes = require('./cafe.routes');
const adminRoutes = require('./admin.routes');

// Public routes
router.use('/auth', authRoutes);
router.use('/cafes', cafeRoutes);

// Admin routes (protected)
router.use('/admin', adminRoutes);

module.exports = router;
