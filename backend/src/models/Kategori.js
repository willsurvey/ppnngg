'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kategori extends Model {
    static associate(models) {
      Kategori.belongsToMany(models.Cafe, {
        through: models.CafeKategori,
        foreignKey: 'kategori_id',
        otherKey: 'cafe_id',
        as: 'cafes'
      });
    }
  }

  Kategori.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama_kategori: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Kategori',
    tableName: 'kategori',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['nama_kategori'], unique: true }
    ]
  });

  return Kategori;
};
