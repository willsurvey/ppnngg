'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Insert 5 cafes (lokasi_id 1-10 = Ponorogo kecamatan, admin_id = 1)
    const cafes = [
      {
        lokasi_id: 1, admin_id: 1, nama_cafe: 'Kopi Nongko Ponorogo',
        slug: 'kopi-nongko-ponorogo',
        alamat: 'Jl. Soekarno Hatta No. 12, Ponorogo',
        latitude: -7.8650, longitude: 111.4620,
        no_telepon: '081234567801', harga_min: 10000, harga_max: 35000,
        deskripsi: 'Cafe kopi lokal terbaik di pusat kota Ponorogo dengan suasana hangat dan nyaman.',
        sesi_buka: 'siang', is_active: true, completeness_score: 80,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 2, admin_id: 1, nama_cafe: 'Warung Kopi Babadan',
        slug: 'warung-kopi-babadan',
        alamat: 'Jl. Raya Babadan No. 45',
        latitude: -7.8510, longitude: 111.4480,
        no_telepon: '081234567802', harga_min: 8000, harga_max: 25000,
        deskripsi: 'Tempat nongkrong favorit anak muda Babadan dengan WiFi kencang dan menu lengkap.',
        sesi_buka: 'malam', is_active: true, completeness_score: 75,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 3, admin_id: 1, nama_cafe: 'Cafe Siman Asri',
        slug: 'cafe-siman-asri',
        alamat: 'Jl. Siman Raya No. 88',
        latitude: -7.8820, longitude: 111.4810,
        no_telepon: '081234567803', harga_min: 15000, harga_max: 50000,
        deskripsi: 'Cafe keluarga dengan taman outdoor luas dan playground anak di kecamatan Siman.',
        sesi_buka: 'siang', is_active: true, completeness_score: 85,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 1, admin_id: 1, nama_cafe: 'Ngopi Bareng',
        slug: 'ngopi-bareng',
        alamat: 'Jl. HOS Cokroaminoto No. 55, Ponorogo',
        latitude: -7.8680, longitude: 111.4700,
        no_telepon: '081234567804', harga_min: 12000, harga_max: 40000,
        deskripsi: 'Cafe modern dengan live music setiap weekend dan menu specialty coffee.',
        sesi_buka: 'malam', is_active: true, completeness_score: 70,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 5, admin_id: 1, nama_cafe: 'Kedai Reog',
        slug: 'kedai-reog',
        alamat: 'Jl. Raya Mlarak No. 23',
        latitude: -7.8840, longitude: 111.5150,
        no_telepon: '081234567805', harga_min: 5000, harga_max: 20000,
        deskripsi: 'Kedai kopi tradisional dengan cita rasa khas Ponorogo dan harga terjangkau.',
        sesi_buka: 'pagi', is_active: true, completeness_score: 65,
        created_at: now, updated_at: now
      }
    ];

    await queryInterface.bulkInsert('cafe', cafes, {});

    // Insert jam_buka for cafe 1 (7 hari)
    const hari = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const jamBukaData = [];

    // Cafe 1: buka setiap hari 08:00 - 22:00
    for (const h of hari) {
      jamBukaData.push({
        cafe_id: 1, hari: h, jam_buka: '08:00:00', jam_tutup: '22:00:00',
        is_tutup: false, created_at: now, updated_at: now
      });
    }
    // Cafe 2: tutup hari minggu
    for (const h of hari) {
      jamBukaData.push({
        cafe_id: 2, hari: h,
        jam_buka: h === 'minggu' ? null : '10:00:00',
        jam_tutup: h === 'minggu' ? null : '23:00:00',
        is_tutup: h === 'minggu',
        created_at: now, updated_at: now
      });
    }
    // Cafe 3: 09:00 - 21:00 setiap hari
    for (const h of hari) {
      jamBukaData.push({
        cafe_id: 3, hari: h, jam_buka: '09:00:00', jam_tutup: '21:00:00',
        is_tutup: false, created_at: now, updated_at: now
      });
    }
    // Cafe 4: 16:00 - 00:00, tutup senin
    for (const h of hari) {
      jamBukaData.push({
        cafe_id: 4, hari: h,
        jam_buka: h === 'senin' ? null : '16:00:00',
        jam_tutup: h === 'senin' ? null : '00:00:00',
        is_tutup: h === 'senin',
        created_at: now, updated_at: now
      });
    }
    // Cafe 5: 06:00 - 18:00 setiap hari
    for (const h of hari) {
      jamBukaData.push({
        cafe_id: 5, hari: h, jam_buka: '06:00:00', jam_tutup: '18:00:00',
        is_tutup: false, created_at: now, updated_at: now
      });
    }

    await queryInterface.bulkInsert('jam_buka', jamBukaData, {});

    // Insert cafe_kategori (cafe_id, kategori_id)
    const cafeKategori = [
      // Cafe 1: Kopi, Nongkrong, Kerja
      { cafe_id: 1, kategori_id: 5, created_at: now, updated_at: now },
      { cafe_id: 1, kategori_id: 1, created_at: now, updated_at: now },
      { cafe_id: 1, kategori_id: 2, created_at: now, updated_at: now },
      // Cafe 2: Nongkrong, Snack, Live Music
      { cafe_id: 2, kategori_id: 1, created_at: now, updated_at: now },
      { cafe_id: 2, kategori_id: 7, created_at: now, updated_at: now },
      { cafe_id: 2, kategori_id: 8, created_at: now, updated_at: now },
      // Cafe 3: Keluarga, Makanan Berat, Kopi
      { cafe_id: 3, kategori_id: 3, created_at: now, updated_at: now },
      { cafe_id: 3, kategori_id: 6, created_at: now, updated_at: now },
      { cafe_id: 3, kategori_id: 5, created_at: now, updated_at: now },
      // Cafe 4: Live Music, Romantis, Kopi
      { cafe_id: 4, kategori_id: 8, created_at: now, updated_at: now },
      { cafe_id: 4, kategori_id: 4, created_at: now, updated_at: now },
      { cafe_id: 4, kategori_id: 5, created_at: now, updated_at: now },
      // Cafe 5: Kopi, Snack
      { cafe_id: 5, kategori_id: 5, created_at: now, updated_at: now },
      { cafe_id: 5, kategori_id: 7, created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('cafe_kategori', cafeKategori, {});

    // Insert cafe_fasilitas
    const cafeFasilitas = [
      // Cafe 1: WiFi, AC, Parkir, Toilet, Stop Kontak
      { cafe_id: 1, fasilitas_id: 1, created_at: now, updated_at: now },
      { cafe_id: 1, fasilitas_id: 2, created_at: now, updated_at: now },
      { cafe_id: 1, fasilitas_id: 3, created_at: now, updated_at: now },
      { cafe_id: 1, fasilitas_id: 5, created_at: now, updated_at: now },
      { cafe_id: 1, fasilitas_id: 6, created_at: now, updated_at: now },
      // Cafe 2: WiFi, Outdoor, Live Music
      { cafe_id: 2, fasilitas_id: 1, created_at: now, updated_at: now },
      { cafe_id: 2, fasilitas_id: 8, created_at: now, updated_at: now },
      { cafe_id: 2, fasilitas_id: 7, created_at: now, updated_at: now },
      // Cafe 3: WiFi, AC, Parkir, Musholla, Playground, Outdoor
      { cafe_id: 3, fasilitas_id: 1, created_at: now, updated_at: now },
      { cafe_id: 3, fasilitas_id: 2, created_at: now, updated_at: now },
      { cafe_id: 3, fasilitas_id: 3, created_at: now, updated_at: now },
      { cafe_id: 3, fasilitas_id: 4, created_at: now, updated_at: now },
      { cafe_id: 3, fasilitas_id: 9, created_at: now, updated_at: now },
      { cafe_id: 3, fasilitas_id: 8, created_at: now, updated_at: now },
      // Cafe 4: WiFi, Live Music, Outdoor
      { cafe_id: 4, fasilitas_id: 1, created_at: now, updated_at: now },
      { cafe_id: 4, fasilitas_id: 7, created_at: now, updated_at: now },
      { cafe_id: 4, fasilitas_id: 8, created_at: now, updated_at: now },
      // Cafe 5: Parkir, Musholla, Toilet
      { cafe_id: 5, fasilitas_id: 3, created_at: now, updated_at: now },
      { cafe_id: 5, fasilitas_id: 4, created_at: now, updated_at: now },
      { cafe_id: 5, fasilitas_id: 5, created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('cafe_fasilitas', cafeFasilitas, {});

    // Insert foto_cafe (sample placeholder URLs)
    const fotoCafe = [
      { cafe_id: 1, url_foto: '/uploads/cafe1-1.jpg', urutan: 1, caption: 'Interior cafe', created_at: now, updated_at: now },
      { cafe_id: 1, url_foto: '/uploads/cafe1-2.jpg', urutan: 2, caption: 'Menu kopi', created_at: now, updated_at: now },
      { cafe_id: 2, url_foto: '/uploads/cafe2-1.jpg', urutan: 1, caption: 'Area outdoor', created_at: now, updated_at: now },
      { cafe_id: 3, url_foto: '/uploads/cafe3-1.jpg', urutan: 1, caption: 'Taman bermain', created_at: now, updated_at: now },
      { cafe_id: 3, url_foto: '/uploads/cafe3-2.jpg', urutan: 2, caption: 'Ruang indoor', created_at: now, updated_at: now },
      { cafe_id: 4, url_foto: '/uploads/cafe4-1.jpg', urutan: 1, caption: 'Live music stage', created_at: now, updated_at: now },
      { cafe_id: 5, url_foto: '/uploads/cafe5-1.jpg', urutan: 1, caption: 'Tampak depan', created_at: now, updated_at: now }
    ];

    await queryInterface.bulkInsert('foto_cafe', fotoCafe, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('foto_cafe', null, {});
    await queryInterface.bulkDelete('cafe_fasilitas', null, {});
    await queryInterface.bulkDelete('cafe_kategori', null, {});
    await queryInterface.bulkDelete('jam_buka', null, {});
    await queryInterface.bulkDelete('cafe', null, {});
  }
};
