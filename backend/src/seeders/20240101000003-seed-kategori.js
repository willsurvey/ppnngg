'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const data = [
      { nama_kategori: 'Nongkrong', deskripsi: 'Cafe cocok untuk nongkrong dan bersantai bersama teman' },
      { nama_kategori: 'Kerja', deskripsi: 'Cafe nyaman untuk kerja remote atau belajar' },
      { nama_kategori: 'Keluarga', deskripsi: 'Cafe ramah anak dan keluarga' },
      { nama_kategori: 'Romantis', deskripsi: 'Cafe dengan suasana romantis untuk pasangan' },
      { nama_kategori: 'Kopi', deskripsi: 'Cafe spesialis kopi dan specialty coffee' },
      { nama_kategori: 'Makanan Berat', deskripsi: 'Cafe dengan menu makanan lengkap' },
      { nama_kategori: 'Snack', deskripsi: 'Cafe dengan menu ringan dan camilan' },
      { nama_kategori: 'Live Music', deskripsi: 'Cafe dengan pertunjukan musik live' }
    ].map(d => ({ ...d, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('kategori', data, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('kategori', null, {});
  }
};
