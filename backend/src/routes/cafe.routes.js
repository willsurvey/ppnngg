const express = require('express');
const router = express.Router();
const cafeController = require('../controllers/cafeController');

// GET /v1/cafes - List all cafes with filter + pagination
router.get('/', cafeController.getAllCafes);

// GET /v1/cafes/search - Search cafes by name/address
router.get('/search', cafeController.searchCafes);

// GET /v1/cafes/nearby - Nearby cafes by coordinates
router.get('/nearby', cafeController.getNearbyCafes);

// GET /v1/cafes/filters/options - Get filter dropdown options
router.get('/filters/options', cafeController.getFilterOptions);

// GET /v1/cafes/:slug - Detail cafe by slug
router.get('/:slug', cafeController.getCafeBySlug);

module.exports = router;
