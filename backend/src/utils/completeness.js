/**
 * Calculate profile completeness percentage (0-100)
 * Based on weighted fields from the implementation plan
 */

const weights = {
  nama: 10,
  alamat: 10,
  kecamatan: 5,
  latitude: 10,
  longitude: 10,
  harga_min: 5,
  harga_max: 5,
  jam_buka: 5,
  sesi_buka: 5,
  suasana: 5,
  instagram: 5,
  fasilitas_filled: 10,
  foto_min_1: 10,
  foto_min_3: 5
};

/**
 * Calculate completeness percentage for a cafe
 * @param {Object} cafe - Cafe object with fields
 * @param {Object|null} fasilitas - Fasilitas object or null
 * @param {number} fotoCount - Number of photos
 * @returns {number} Completeness percentage (0-100)
 */
function calculateCompleteness(cafe, fasilitas, fotoCount) {
  let score = 0;

  if (cafe.nama && cafe.nama.trim()) score += weights.nama;
  if (cafe.alamat && cafe.alamat.trim()) score += weights.alamat;
  if (cafe.kecamatan) score += weights.kecamatan;
  if (cafe.latitude != null) score += weights.latitude;
  if (cafe.longitude != null) score += weights.longitude;
  if (cafe.harga_min != null) score += weights.harga_min;
  if (cafe.harga_max != null) score += weights.harga_max;
  if (cafe.jam_buka) score += weights.jam_buka;
  if (cafe.sesi_buka) score += weights.sesi_buka;
  if (cafe.suasana && cafe.suasana.trim()) score += weights.suasana;
  if (cafe.instagram && cafe.instagram.trim()) score += weights.instagram;

  // Check if fasilitas record exists and has at least one field set
  if (fasilitas) {
    const hasFilled = fasilitas.ac || fasilitas.wifi || fasilitas.toilet ||
      fasilitas.mushola || fasilitas.ruang_rapat || fasilitas.parkir || fasilitas.colokan;
    if (hasFilled) score += weights.fasilitas_filled;
  }

  // Photo checks
  if (fotoCount >= 1) score += weights.foto_min_1;
  if (fotoCount >= 3) score += weights.foto_min_3;

  return Math.min(score, 100);
}

module.exports = { calculateCompleteness, weights };
