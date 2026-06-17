/**
 * Calculate profile completeness percentage (0-100)
 * Based on weighted fields for enterprise 9-table schema
 */

const weights = {
  nama_cafe: 10,
  alamat: 10,
  lokasi_id: 5,
  latitude: 10,
  longitude: 10,
  harga_min: 5,
  harga_max: 5,
  no_telepon: 5,
  deskripsi: 5,
  sesi_buka: 5,
  kategori_filled: 5,
  fasilitas_filled: 10,
  jam_buka_filled: 5,
  foto_min_1: 5,
  foto_min_3: 5
};

/**
 * Calculate completeness percentage for a cafe
 * @param {Object} cafe - Cafe object with fields
 * @param {Array} kategori - Array of kategori objects
 * @param {Array} fasilitas - Array of fasilitas objects
 * @param {Array} jamBuka - Array of jam_buka objects
 * @param {number} fotoCount - Number of photos
 * @returns {number} Completeness percentage (0-100)
 */
function calculateCompleteness(cafe, kategori, fasilitas, jamBuka, fotoCount) {
  let score = 0;

  if (cafe.nama_cafe && cafe.nama_cafe.trim()) score += weights.nama_cafe;
  if (cafe.alamat && cafe.alamat.trim()) score += weights.alamat;
  if (cafe.lokasi_id) score += weights.lokasi_id;
  if (cafe.latitude != null) score += weights.latitude;
  if (cafe.longitude != null) score += weights.longitude;
  if (cafe.harga_min != null) score += weights.harga_min;
  if (cafe.harga_max != null) score += weights.harga_max;
  if (cafe.no_telepon && cafe.no_telepon.trim()) score += weights.no_telepon;
  if (cafe.deskripsi && cafe.deskripsi.trim()) score += weights.deskripsi;
  if (cafe.sesi_buka) score += weights.sesi_buka;

  // Check if at least one kategori is assigned
  if (kategori && kategori.length > 0) score += weights.kategori_filled;

  // Check if at least one fasilitas is assigned
  if (fasilitas && fasilitas.length > 0) score += weights.fasilitas_filled;

  // Check if jam buka has at least one entry
  if (jamBuka && jamBuka.length > 0) score += weights.jam_buka_filled;

  // Photo checks
  if (fotoCount >= 1) score += weights.foto_min_1;
  if (fotoCount >= 3) score += weights.foto_min_3;

  return Math.min(score, 100);
}

module.exports = { calculateCompleteness, weights };
