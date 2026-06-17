const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const loginValidation = [
  body('username').notEmpty().withMessage('Username wajib diisi').isLength({ min: 3, max: 50 }).withMessage('Username harus 3-50 karakter'),
  body('password').notEmpty().withMessage('Password wajib diisi').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  validate
];

// Cafe validation rules
const createCafeValidation = [
  body('nama_cafe').notEmpty().withMessage('Nama cafe wajib diisi').isLength({ max: 200 }).withMessage('Nama cafe maksimal 200 karakter'),
  body('lokasi_id').notEmpty().withMessage('Lokasi wajib dipilih').isInt({ min: 1 }).withMessage('Lokasi tidak valid'),
  body('alamat').optional().isLength({ max: 500 }).withMessage('Alamat maksimal 500 karakter'),
  body('latitude').optional().isDecimal().withMessage('Latitude tidak valid'),
  body('longitude').optional().isDecimal().withMessage('Longitude tidak valid'),
  body('no_telepon').optional().isLength({ max: 20 }).withMessage('No telepon maksimal 20 karakter'),
  body('harga_min').optional().isInt({ min: 0 }).withMessage('Harga minimum harus angka positif'),
  body('harga_max').optional().isInt({ min: 0 }).withMessage('Harga maximum harus angka positif'),
  body('deskripsi').optional().isLength({ max: 2000 }).withMessage('Deskripsi maksimal 2000 karakter'),
  body('sesi_buka').optional().isIn(['pagi', 'siang', 'malam']).withMessage('Sesi buka harus pagi, siang, atau malam'),
  body('kategori_ids').optional().isArray().withMessage('Kategori harus berupa array'),
  body('fasilitas_ids').optional().isArray().withMessage('Fasilitas harus berupa array'),
  body('jam_buka').optional().isArray().withMessage('Jam buka harus berupa array'),
  validate
];

const updateCafeValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID cafe tidak valid'),
  body('nama_cafe').optional().isLength({ max: 200 }).withMessage('Nama cafe maksimal 200 karakter'),
  body('lokasi_id').optional().isInt({ min: 1 }).withMessage('Lokasi tidak valid'),
  body('alamat').optional().isLength({ max: 500 }).withMessage('Alamat maksimal 500 karakter'),
  body('latitude').optional({ nullable: true }).isDecimal().withMessage('Latitude tidak valid'),
  body('longitude').optional({ nullable: true }).isDecimal().withMessage('Longitude tidak valid'),
  body('no_telepon').optional({ nullable: true }).isLength({ max: 20 }).withMessage('No telepon maksimal 20 karakter'),
  body('harga_min').optional({ nullable: true }).isInt({ min: 0 }).withMessage('Harga minimum harus angka positif'),
  body('harga_max').optional({ nullable: true }).isInt({ min: 0 }).withMessage('Harga maximum harus angka positif'),
  body('deskripsi').optional({ nullable: true }).isLength({ max: 2000 }).withMessage('Deskripsi maksimal 2000 karakter'),
  body('sesi_buka').optional({ nullable: true }).isIn(['pagi', 'siang', 'malam']).withMessage('Sesi buka harus pagi, siang, atau malam'),
  body('kategori_ids').optional().isArray().withMessage('Kategori harus berupa array'),
  body('fasilitas_ids').optional().isArray().withMessage('Fasilitas harus berupa array'),
  body('jam_buka').optional().isArray().withMessage('Jam buka harus berupa array'),
  validate
];

// Kategori validation
const setKategoriValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID cafe tidak valid'),
  body('kategori_ids').isArray({ min: 0 }).withMessage('Kategori harus berupa array'),
  validate
];

// Fasilitas validation
const setFasilitasValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID cafe tidak valid'),
  body('fasilitas_ids').isArray({ min: 0 }).withMessage('Fasilitas harus berupa array'),
  validate
];

// Jam Buka validation
const setJamBukaValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID cafe tidak valid'),
  body('jam_buka').isArray({ min: 1 }).withMessage('Jam buka wajib berupa array'),
  body('jam_buka.*.hari').isIn(['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu']).withMessage('Hari tidak valid'),
  body('jam_buka.*.is_tutup').optional().isBoolean().withMessage('is_tutup harus boolean'),
  validate
];

// Foto validation
const uploadFotoValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID cafe tidak valid'),
  body('caption').optional().isLength({ max: 200 }).withMessage('Caption maksimal 200 karakter'),
  validate
];

const deleteFotoValidation = [
  param('foto_id').isInt({ min: 1 }).withMessage('ID foto tidak valid'),
  validate
];

const reorderFotoValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID cafe tidak valid'),
  body('urutan').isArray({ min: 1 }).withMessage('Urutan wajib berupa array berisi ID foto'),
  validate
];

// Public query validations
const searchValidation = [
  query('q').notEmpty().withMessage('Query parameter "q" wajib diisi').isLength({ min: 2 }).withMessage('Query minimal 2 karakter'),
  validate
];

const nearbyValidation = [
  query('lat').notEmpty().withMessage('Parameter "lat" wajib diisi').isDecimal().withMessage('Latitude tidak valid'),
  query('lng').notEmpty().withMessage('Parameter "lng" wajib diisi').isDecimal().withMessage('Longitude tidak valid'),
  validate
];

module.exports = {
  validate,
  loginValidation,
  createCafeValidation,
  updateCafeValidation,
  setKategoriValidation,
  setFasilitasValidation,
  setJamBukaValidation,
  uploadFotoValidation,
  deleteFotoValidation,
  reorderFotoValidation,
  searchValidation,
  nearbyValidation
};
