const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FotoCafe = sequelize.define('tbl_foto_cafe', {
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
  url_foto: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'URL foto wajib diisi' }
    }
  },
  urutan: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
  caption: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'tbl_foto_cafe',
  timestamps: true,
  updatedAt: false
});

module.exports = FotoCafe;
