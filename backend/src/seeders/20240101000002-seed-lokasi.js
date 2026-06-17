'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const data = [
      { nama_kecamatan: 'Ponorogo', latitude: -7.8667, longitude: 111.4667 },
      { nama_kecamatan: 'Babadan', latitude: -7.8500, longitude: 111.4500 },
      { nama_kecamatan: 'Siman', latitude: -7.8833, longitude: 111.4833 },
      { nama_kecamatan: 'Jetis', latitude: -7.9000, longitude: 111.4500 },
      { nama_kecamatan: 'Mlarak', latitude: -7.8833, longitude: 111.5167 },
      { nama_kecamatan: 'Kauman', latitude: -7.8500, longitude: 111.5000 },
      { nama_kecamatan: 'Badegan', latitude: -7.9167, longitude: 111.3833 },
      { nama_kecamatan: 'Sampung', latitude: -7.9333, longitude: 111.4333 },
      { nama_kecamatan: 'Slahung', latitude: -7.9500, longitude: 111.4667 },
      { nama_kecamatan: 'Ngrayun', latitude: -7.9667, longitude: 111.5333 }
    ].map(d => ({ ...d, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('lokasi', data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('lokasi', null, {});
  }
};
