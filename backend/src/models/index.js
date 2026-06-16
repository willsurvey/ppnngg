const sequelize = require('../config/database');
const Admin = require('./Admin');
const Cafe = require('./Cafe');
const Fasilitas = require('./Fasilitas');
const FotoCafe = require('./FotoCafe');

// Associations
// Cafe 1:1 Fasilitas
Cafe.hasOne(Fasilitas, { foreignKey: 'cafe_id', as: 'fasilitas', onDelete: 'CASCADE' });
Fasilitas.belongsTo(Cafe, { foreignKey: 'cafe_id' });

// Cafe 1:N FotoCafe
Cafe.hasMany(FotoCafe, { foreignKey: 'cafe_id', as: 'fotos', onDelete: 'CASCADE' });
FotoCafe.belongsTo(Cafe, { foreignKey: 'cafe_id' });

module.exports = {
  sequelize,
  Admin,
  Cafe,
  Fasilitas,
  FotoCafe
};
