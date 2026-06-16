const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('tbl_admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Username wajib diisi' }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password wajib diisi' }
    }
  }
}, {
  tableName: 'tbl_admin',
  timestamps: true,
  updatedAt: false
});

module.exports = Admin;
