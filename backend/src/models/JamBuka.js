'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class JamBuka extends Model {
    static associate(models) {
      JamBuka.belongsTo(models.Cafe, { foreignKey: 'cafe_id' });
    }
  }

  JamBuka.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cafe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'cafe', key: 'id' },
      onDelete: 'CASCADE'
    },
    hari: {
      type: DataTypes.ENUM('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'),
      allowNull: false
    },
    jam_buka: {
      type: DataTypes.TIME,
      allowNull: true
    },
    jam_tutup: {
      type: DataTypes.TIME,
      allowNull: true
    },
    is_tutup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'JamBuka',
    tableName: 'jam_buka',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['cafe_id'] },
      { fields: ['cafe_id', 'hari'], unique: true }
    ]
  });

  return JamBuka;
};
