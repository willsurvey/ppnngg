'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cafe extends Model {
    static associate(models) {
      // Cafe belongs to Lokasi
      Cafe.belongsTo(models.Lokasi, { foreignKey: 'lokasi_id', as: 'lokasi' });

      // Cafe belongs to Admin (who created it)
      Cafe.belongsTo(models.Admin, { foreignKey: 'admin_id', as: 'admin' });

      // Cafe has many JamBuka
      Cafe.hasMany(models.JamBuka, { foreignKey: 'cafe_id', as: 'jam_buka', onDelete: 'CASCADE' });

      // Cafe has many FotoCafe
      Cafe.hasMany(models.FotoCafe, { foreignKey: 'cafe_id', as: 'fotos', onDelete: 'CASCADE' });

      // Cafe M:N Kategori (through CafeKategori)
      Cafe.belongsToMany(models.Kategori, {
        through: models.CafeKategori,
        foreignKey: 'cafe_id',
        otherKey: 'kategori_id',
        as: 'kategori'
      });

      // Cafe M:N Fasilitas (through CafeFasilitas)
      Cafe.belongsToMany(models.Fasilitas, {
        through: models.CafeFasilitas,
        foreignKey: 'cafe_id',
        otherKey: 'fasilitas_id',
        as: 'fasilitas'
      });
    }
  }

  Cafe.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lokasi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'lokasi', key: 'id' },
      onDelete: 'RESTRICT'
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'admin', key: 'id' },
      onDelete: 'SET NULL'
    },
    nama_cafe: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    no_telepon: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    harga_min: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    harga_max: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sesi_buka: {
      type: DataTypes.ENUM('pagi', 'siang', 'malam'),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    completeness_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Cafe',
    tableName: 'cafe',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['lokasi_id'] },
      { fields: ['nama_cafe'] },
      { fields: ['is_active'] },
      { fields: ['sesi_buka'] }
    ]
  });

  return Cafe;
};
