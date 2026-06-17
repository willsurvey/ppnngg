'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CafeKategori extends Model {
    static associate(models) {
      CafeKategori.belongsTo(models.Cafe, { foreignKey: 'cafe_id' });
      CafeKategori.belongsTo(models.Kategori, { foreignKey: 'kategori_id' });
    }
  }

  CafeKategori.init({
    cafe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'cafe', key: 'id' },
      onDelete: 'CASCADE'
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'kategori', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'CafeKategori',
    tableName: 'cafe_kategori',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['cafe_id'] },
      { fields: ['kategori_id'] }
    ]
  });

  return CafeKategori;
};
