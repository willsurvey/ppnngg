'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    // 1. Seed admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('admin', [
      {
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        created_at: now,
        updated_at: now
      }
    ], { ignoreDuplicates: true });

    // 2. Seed lokasi (kecamatan di Ponorogo)
    const lokasiData = [
      { nama_kecamatan: 'Ponorogo', latitude: -7.86590000, longitude: 111.46470000 },
      { nama_kecamatan: 'Babadan', latitude: -7.85230000, longitude: 111.47890000 },
      { nama_kecamatan: 'Jenangan', latitude: -7.87840000, longitude: 111.45120000 },
      { nama_kecamatan: 'Mlarak', latitude: -7.84560000, longitude: 111.48900000 },
      { nama_kecamatan: 'Siman', latitude: -7.88910000, longitude: 111.45670000 },
      { nama_kecamatan: 'Kauman', latitude: -7.83420000, longitude: 111.46780000 },
      { nama_kecamatan: 'Ngebel', latitude: -7.82340000, longitude: 111.51230000 },
      { nama_kecamatan: 'Sawoo', latitude: -7.91230000, longitude: 111.49870000 },
      { nama_kecamatan: 'Sooko', latitude: -7.85670000, longitude: 111.42340000 },
      { nama_kecamatan: 'Balong', latitude: -7.87890000, longitude: 111.40120000 }
    ];
    await queryInterface.bulkInsert('lokasi', lokasiData.map(l => ({
      ...l, created_at: now, updated_at: now
    })), { ignoreDuplicates: true });

    // 3. Seed kategori (suasana/tipe cafe)
    const kategoriData = [
      { nama_kategori: 'Aesthetic', deskripsi: 'Cafe dengan desain instagramable dan visual menarik' },
      { nama_kategori: 'Cozy', deskripsi: 'Cafe dengan suasana nyaman dan hangat' },
      { nama_kategori: 'Outdoor', deskripsi: 'Cafe dengan area terbuka dan pemandangan alam' },
      { nama_kategori: 'Study Friendly', deskripsi: 'Cafe cocok untuk belajar dan bekerja' },
      { nama_kategori: 'Industrial', deskripsi: 'Cafe dengan desain industrial modern' },
      { nama_kategori: 'Traditional', deskripsi: 'Cafe dengan nuansa tradisional dan lokal' },
      { nama_kategori: 'Family', deskripsi: 'Cafe ramah keluarga dengan area bermain' },
      { nama_kategori: 'Rooftop', deskripsi: 'Cafe di atas gedung dengan pemandangan kota' }
    ];
    await queryInterface.bulkInsert('kategori', kategoriData.map(k => ({
      ...k, created_at: now, updated_at: now
    })), { ignoreDuplicates: true });

    // 4. Seed fasilitas (master data)
    const fasilitasData = [
      { nama_fasilitas: 'AC', icon: 'snowflake' },
      { nama_fasilitas: 'WiFi', icon: 'wifi' },
      { nama_fasilitas: 'Toilet', icon: 'restroom' },
      { nama_fasilitas: 'Mushola', icon: 'mosque' },
      { nama_fasilitas: 'Ruang Rapat', icon: 'meeting-room' },
      { nama_fasilitas: 'Parkir Luas', icon: 'local-parking' },
      { nama_fasilitas: 'Colokan', icon: 'power' },
      { nama_fasilitas: 'Live Music', icon: 'music-note' },
      { nama_fasilitas: 'Smoking Area', icon: 'smoking-rooms' }
    ];
    await queryInterface.bulkInsert('fasilitas', fasilitasData.map(f => ({
      ...f, created_at: now, updated_at: now
    })), { ignoreDuplicates: true });

    // 5. Seed sample cafes
    const cafes = [
      {
        lokasi_id: 1, admin_id: 1,
        nama_cafe: 'Kopi Nusantara Ponorogo',
        slug: 'kopi-nusantara-ponorogo',
        alamat: 'Jl. Diponegoro No. 12, Ponorogo',
        latitude: -7.86591300, longitude: 111.46471500,
        no_telepon: '081234567890',
        harga_min: 8000, harga_max: 30000,
        deskripsi: 'Cafe kopi premium dengan berbagai pilihan biji kopi nusantara. Suasana aesthetic cocok untuk nongkrong dan foto-foto.',
        sesi_buka: 'pagi',
        completeness_score: 70, is_active: true,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 1, admin_id: 1,
        nama_cafe: 'Rumah Kopi Batara',
        slug: 'rumah-kopi-batara',
        alamat: 'Jl. Batoro Katong No. 5',
        latitude: -7.86712000, longitude: 111.46234000,
        no_telepon: '081234567891',
        harga_min: 10000, harga_max: 35000,
        deskripsi: 'Rumah kopi dengan konsep tradisional modern. Menu lengkap dari kopi hingga makanan berat.',
        sesi_buka: 'siang',
        completeness_score: 70, is_active: true,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 2, admin_id: 1,
        nama_cafe: 'Cafe Senja Babadan',
        slug: 'cafe-senja-babadan',
        alamat: 'Jl. Raya Babadan No. 88',
        latitude: -7.85234000, longitude: 111.47892000,
        no_telepon: '081234567892',
        harga_min: 5000, harga_max: 25000,
        deskripsi: 'Cafe outdoor dengan view sunset terbaik di Babadan. Cocok untuk santai sore.',
        sesi_buka: 'malam',
        completeness_score: 70, is_active: true,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 3, admin_id: 1,
        nama_cafe: 'Ngopi Yuk Jenangan',
        slug: 'ngopi-yuk-jenangan',
        alamat: 'Jl. Raya Jenangan No. 21',
        latitude: -7.87845000, longitude: 111.45123000,
        no_telepon: '081234567893',
        harga_min: 7000, harga_max: 20000,
        deskripsi: 'Cafe cozy di Jenangan dengan harga terjangkau. WiFi kencang dan banyak colokan.',
        sesi_buka: 'pagi',
        completeness_score: 70, is_active: true,
        created_at: now, updated_at: now
      },
      {
        lokasi_id: 4, admin_id: 1,
        nama_cafe: 'Warung Kopi Mlarak',
        slug: 'warung-kopi-mlarak',
        alamat: 'Jl. Raya Mlarak No. 33',
        latitude: -7.84567000, longitude: 111.48901000,
        no_telepon: '081234567894',
        harga_min: 5000, harga_max: 15000,
        deskripsi: 'Warung kopi sederhana tapi nyaman. Harga ramah kantong mahasiswa.',
        sesi_buka: 'malam',
        completeness_score: 70, is_active: true,
        created_at: now, updated_at: now
      }
    ];
    await queryInterface.bulkInsert('cafe', cafes, { ignoreDuplicates: true });

    // 6. Seed cafe_kategori (M:N) - assign multiple kategori per cafe
    const cafeKategoriData = [
      { cafe_id: 1, kategori_id: 1 }, // Aesthetic
      { cafe_id: 1, kategori_id: 4 }, // Study Friendly
      { cafe_id: 2, kategori_id: 6 }, // Traditional
      { cafe_id: 2, kategori_id: 2 }, // Cozy
      { cafe_id: 3, kategori_id: 3 }, // Outdoor
      { cafe_id: 3, kategori_id: 8 }, // Rooftop
      { cafe_id: 4, kategori_id: 2 }, // Cozy
      { cafe_id: 4, kategori_id: 4 }, // Study Friendly
      { cafe_id: 5, kategori_id: 5 }, // Industrial
      { cafe_id: 5, kategori_id: 2 }  // Cozy
    ];
    await queryInterface.bulkInsert('cafe_kategori', cafeKategoriData.map(ck => ({
      ...ck, created_at: now, updated_at: now
    })));

    // 7. Seed cafe_fasilitas (M:N)
    const cafeFasilitasData = [
      { cafe_id: 1, fasilitas_id: 1 }, // AC
      { cafe_id: 1, fasilitas_id: 2 }, // WiFi
      { cafe_id: 1, fasilitas_id: 3 }, // Toilet
      { cafe_id: 1, fasilitas_id: 7 }, // Colokan
      { cafe_id: 1, fasilitas_id: 6 }, // Parkir
      { cafe_id: 2, fasilitas_id: 1 }, // AC
      { cafe_id: 2, fasilitas_id: 2 }, // WiFi
      { cafe_id: 2, fasilitas_id: 3 }, // Toilet
      { cafe_id: 2, fasilitas_id: 4 }, // Mushola
      { cafe_id: 2, fasilitas_id: 5 }, // Ruang Rapat
      { cafe_id: 2, fasilitas_id: 6 }, // Parkir
      { cafe_id: 3, fasilitas_id: 2 }, // WiFi
      { cafe_id: 3, fasilitas_id: 3 }, // Toilet
      { cafe_id: 3, fasilitas_id: 6 }, // Parkir
      { cafe_id: 3, fasilitas_id: 8 }, // Live Music
      { cafe_id: 4, fasilitas_id: 2 }, // WiFi
      { cafe_id: 4, fasilitas_id: 3 }, // Toilet
      { cafe_id: 4, fasilitas_id: 4 }, // Mushola
      { cafe_id: 4, fasilitas_id: 7 }, // Colokan
      { cafe_id: 5, fasilitas_id: 2 }, // WiFi
      { cafe_id: 5, fasilitas_id: 3 }, // Toilet
      { cafe_id: 5, fasilitas_id: 6 }, // Parkir
      { cafe_id: 5, fasilitas_id: 9 }  // Smoking Area
    ];
    await queryInterface.bulkInsert('cafe_fasilitas', cafeFasilitasData.map(cf => ({
      ...cf, created_at: now, updated_at: now
    })));

    // 8. Seed jam_buka (operating hours per day)
    const hariList = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const jamBukaData = [];
    // Cafe 1: 07:00 - 22:00 every day
    for (const hari of hariList) {
      jamBukaData.push({ cafe_id: 1, hari, jam_buka: '07:00:00', jam_tutup: '22:00:00', is_tutup: false, created_at: now, updated_at: now });
    }
    // Cafe 2: 08:00 - 23:00 every day
    for (const hari of hariList) {
      jamBukaData.push({ cafe_id: 2, hari, jam_buka: '08:00:00', jam_tutup: '23:00:00', is_tutup: false, created_at: now, updated_at: now });
    }
    // Cafe 3: 15:00 - 01:00, closed on monday
    for (const hari of hariList) {
      jamBukaData.push({
        cafe_id: 3, hari,
        jam_buka: hari === 'senin' ? null : '15:00:00',
        jam_tutup: hari === 'senin' ? null : '01:00:00',
        is_tutup: hari === 'senin',
        created_at: now, updated_at: now
      });
    }
    // Cafe 4: 06:00 - 21:00 every day
    for (const hari of hariList) {
      jamBukaData.push({ cafe_id: 4, hari, jam_buka: '06:00:00', jam_tutup: '21:00:00', is_tutup: false, created_at: now, updated_at: now });
    }
    // Cafe 5: 16:00 - 02:00, closed on sunday
    for (const hari of hariList) {
      jamBukaData.push({
        cafe_id: 5, hari,
        jam_buka: hari === 'minggu' ? null : '16:00:00',
        jam_tutup: hari === 'minggu' ? null : '02:00:00',
        is_tutup: hari === 'minggu',
        created_at: now, updated_at: now
      });
    }
    await queryInterface.bulkInsert('jam_buka', jamBukaData);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('jam_buka', null, {});
    await queryInterface.bulkDelete('cafe_fasilitas', null, {});
    await queryInterface.bulkDelete('cafe_kategori', null, {});
    await queryInterface.bulkDelete('foto_cafe', null, {});
    await queryInterface.bulkDelete('cafe', null, {});
    await queryInterface.bulkDelete('fasilitas', null, {});
    await queryInterface.bulkDelete('kategori', null, {});
    await queryInterface.bulkDelete('lokasi', null, {});
    await queryInterface.bulkDelete('admin', null, {});
  }
};
