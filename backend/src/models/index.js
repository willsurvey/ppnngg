const sequelize = require('../config/database');
const Admin = require('./Admin');
const Lokasi = require('./Lokasi');
const Kategori = require('./Kategori');
const Cafe = require('./Cafe');
const JamBuka = require('./JamBuka');
const Fasilitas = require('./Fasilitas');
const CafeKategori = require('./CafeKategori');
const CafeFasilitas = require('./CafeFasilitas');
const FotoCafe = require('./FotoCafe');

// Initialize all associations
Admin.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
Lokasi.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
Kategori.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
Cafe.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
JamBuka.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
Fasilitas.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
CafeKategori.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
CafeFasilitas.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });
FotoCafe.associate({ Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe });

module.exports = {
  sequelize,
  Admin,
  Lokasi,
  Kategori,
  Cafe,
  JamBuka,
  Fasilitas,
  CafeKategori,
  CafeFasilitas,
  FotoCafe
};
