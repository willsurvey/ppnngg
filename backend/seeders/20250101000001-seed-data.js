'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // Seed admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('tbl_admin', [
      {
        username: 'admin',
        password: hashedPassword,
        created_at: new Date()
      }
    ]);

    // Seed sample cafes
    const cafes = [
      {
        nama: 'Kopi Nusantara Ponorogo',
        slug: 'kopi-nusantara-ponorogo',
        alamat: 'Jl. Diponegoro No. 12, Ponorogo',
        kecamatan: 'Ponorogo',
        latitude: -7.86591300,
        longitude: 111.46471500,
        harga_min: 8000,
        harga_max: 30000,
        jam_buka: '07:00',
        jam_tutup: '22:00',
        buka_24jam: false,
        sesi_buka: 'pagi',
        suasana: 'aesthetic',
        instagram: 'kopinusantara_pnrg',
        google_maps_url: 'https://maps.google.com/?q=-7.865913,111.464715',
        completeness_pct: 85,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nama: 'Rumah Kopi Batara',
        slug: 'rumah-kopi-batara',
        alamat: 'Jl. Batoro Katong No. 5',
        kecamatan: 'Ponorogo',
        latitude: -7.86712000,
        longitude: 111.46234000,
        harga_min: 10000,
        harga_max: 35000,
        jam_buka: '08:00',
        jam_tutup: '23:00',
        buka_24jam: false,
        sesi_buka: 'siang',
        suasana: 'study',
        instagram: 'rumahkopi_batara',
        google_maps_url: 'https://maps.google.com/?q=-7.86712,111.46234',
        completeness_pct: 85,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nama: 'Cafe Senja Babadan',
        slug: 'cafe-senja-babadan',
        alamat: 'Jl. Raya Babadan No. 88',
        kecamatan: 'Babadan',
        latitude: -7.85234000,
        longitude: 111.47892000,
        harga_min: 5000,
        harga_max: 25000,
        jam_buka: '15:00',
        jam_tutup: '01:00',
        buka_24jam: false,
        sesi_buka: 'sore',
        suasana: 'outdoor',
        instagram: 'cafesenja_bbd',
        google_maps_url: 'https://maps.google.com/?q=-7.85234,111.47892',
        completeness_pct: 85,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nama: 'Ngopi Yuk Jenangan',
        slug: 'ngopi-yuk-jenangan',
        alamat: 'Jl. Raya Jenangan No. 21',
        kecamatan: 'Jenangan',
        latitude: -7.87845000,
        longitude: 111.45123000,
        harga_min: 7000,
        harga_max: 20000,
        jam_buka: '06:00',
        jam_tutup: '21:00',
        buka_24jam: false,
        sesi_buka: 'pagi',
        suasana: 'cozy',
        instagram: 'ngopiyuk_jenangan',
        google_maps_url: 'https://maps.google.com/?q=-7.87845,111.45123',
        completeness_pct: 85,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nama: 'Warung Kopi Mlarak',
        slug: 'warung-kopi-mlarak',
        alamat: 'Jl. Raya Mlarak No. 33',
        kecamatan: 'Mlarak',
        latitude: -7.84567000,
        longitude: 111.48901000,
        harga_min: 5000,
        harga_max: 15000,
        jam_buka: '16:00',
        jam_tutup: '02:00',
        buka_24jam: false,
        sesi_buka: 'malam',
        suasana: 'industrial',
        instagram: 'wk_mlarak',
        google_maps_url: 'https://maps.google.com/?q=-7.84567,111.48901',
        completeness_pct: 85,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('tbl_cafe', cafes);

    // Seed fasilitas for each cafe
    const fasilitasData = cafes.map((cafe, index) => ({
      cafe_id: index + 1,
      ac: index < 3,
      wifi: true,
      toilet: true,
      mushola: index < 2,
      ruang_rapat: index === 0,
      parkir: true,
      colokan: index < 4,
      created_at: new Date(),
      updated_at: new Date()
    }));
    await queryInterface.bulkInsert('tbl_fasilitas', fasilitasData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('tbl_fasilitas', null, {});
    await queryInterface.bulkDelete('tbl_foto_cafe', null, {});
    await queryInterface.bulkDelete('tbl_cafe', null, {});
    await queryInterface.bulkDelete('tbl_admin', null, {});
  }
};
