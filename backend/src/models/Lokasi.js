'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lokasi extends Model {
    static associate(models) {
      Lokasi.hasMany(models.Cafe, { foreignKey: 'lokasi_id', as: 'cafes' });
    }
  }

  Lokasi.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_kecamatan: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Lokasi',
    tableName: 'lokasi',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['nama_kecamatan'], unique: true }
    ]
  });

  return Lokasi;
};
