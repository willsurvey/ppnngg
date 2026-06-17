const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Initialize all models with sequelize instance
const Admin = require('./Admin')(sequelize, DataTypes);
const Lokasi = require('./Lokasi')(sequelize, DataTypes);
const Kategori = require('./Kategori')(sequelize, DataTypes);
const Cafe = require('./Cafe')(sequelize, DataTypes);
const JamBuka = require('./JamBuka')(sequelize, DataTypes);
const Fasilitas = require('./Fasilitas')(sequelize, DataTypes);
const CafeKategori = require('./CafeKategori')(sequelize, DataTypes);
const CafeFasilitas = require('./CafeFasilitas')(sequelize, DataTypes);
const FotoCafe = require('./FotoCafe')(sequelize, DataTypes);

const models = { Admin, Lokasi, Kategori, Cafe, JamBuka, Fasilitas, CafeKategori, CafeFasilitas, FotoCafe };

// Initialize all associations
Admin.associate(models);
Lokasi.associate(models);
Kategori.associate(models);
Cafe.associate(models);
JamBuka.associate(models);
Fasilitas.associate(models);
CafeKategori.associate(models);
CafeFasilitas.associate(models);
FotoCafe.associate(models);

module.exports = {
  sequelize,
  ...models
};
