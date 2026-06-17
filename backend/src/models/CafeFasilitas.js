'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CafeFasilitas extends Model {
    static associate(models) {
      CafeFasilitas.belongsTo(models.Cafe, { foreignKey: 'cafe_id' });
      CafeFasilitas.belongsTo(models.Fasilitas, { foreignKey: 'fasilitas_id' });
    }
  }

  CafeFasilitas.init({
    cafe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'cafe', key: 'id' },
      onDelete: 'CASCADE'
    },
    fasilitas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'fasilitas', key: 'id' },
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'CafeFasilitas',
    tableName: 'cafe_fasilitas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['cafe_id'] },
      { fields: ['fasilitas_id'] }
    ]
  });

  return CafeFasilitas;
};
