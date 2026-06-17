'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const data = [
      { nama_fasilitas: 'WiFi', icon: 'wifi' },
      { nama_fasilitas: 'AC', icon: 'ac' },
      { nama_fasilitas: 'Parkir Luas', icon: 'parking' },
      { nama_fasilitas: 'Musholla', icon: 'prayer' },
      { nama_fasilitas: 'Toilet', icon: 'toilet' },
      { nama_fasilitas: 'Stop Kontak', icon: 'power' },
      { nama_fasilitas: 'Live Music', icon: 'music' },
      { nama_fasilitas: 'Outdoor', icon: 'outdoor' },
      { nama_fasilitas: 'Playground', icon: 'playground' }
    ].map(d => ({ ...d, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('fasilitas', data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('fasilitas', null, {});
  }
};
