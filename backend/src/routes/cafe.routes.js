const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');

// GET /cafes - List all cafes with filter + pagination
router.get('/', cafeController.getAllCafes);

// GET /cafes/search - Search cafes by name/address
router.get('/search', cafeController.searchCafes);

// GET /cafes/nearby - Nearby cafes by coordinates
router.get('/nearby', cafeController.getNearbyCafes);

// GET /cafes/filters/options - Get filter dropdown options
router.get('/filters/options', cafeController.getFilterOptions);

// GET /cafes/:slug - Detail cafe by slug
router.get('/:slug', cafeController.getCafeBySlug);

module.exports = router;
