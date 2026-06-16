const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fasilitas = sequelize.define('tbl_fasilitas', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cafe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tbl_cafe',
      key: 'id'
    }
  },
  ac: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  wifi: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  toilet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  mushola: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ruang_rapat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  parkir: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  colokan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tbl_fasilitas',
  timestamps: true
});

module.exports = Fasilitas;
