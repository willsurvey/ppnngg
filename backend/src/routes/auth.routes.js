const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /auth/login - Public
router.post('/login', authController.login);

// POST /auth/logout - Protected
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
