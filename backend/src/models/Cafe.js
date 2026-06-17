const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cafe = sequelize.define('tbl_cafe', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nama: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nama cafe wajib diisi' }
    }
  },
  slug: {
    type: DataTypes.STRING(160),
    allowNull: false,
    unique: true
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  kecamatan: {
    type: DataTypes.ENUM(
      'Ponorogo', 'Babadan', 'Jenangan', 'Mlarak', 'Siman',
      'Balong', 'Kauman', 'Ngebel', 'Sooko', 'Pulung',
      'Mungkal', 'Slahung', 'Ngrayun', 'Bungkal', 'Sawoo',
      'Sampung', 'Sukorejo', 'Badegan', 'Jambon', 'Pudak'
    ),
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
  harga_min: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: { args: 0, msg: 'Harga minimum tidak boleh negatif' }
    }
  },
  harga_max: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: { args: 0, msg: 'Harga maximum tidak boleh negatif' }
    }
  },
  jam_buka: {
    type: DataTypes.TIME,
    allowNull: true
  },
  jam_tutup: {
    type: DataTypes.TIME,
    allowNull: true
  },
  buka_24jam: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sesi_buka: {
    type: DataTypes.ENUM('pagi', 'siang', 'sore', 'malam', '24jam'),
    allowNull: true
  },
  suasana: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  instagram: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  google_maps_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completeness_pct: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tbl_cafe',
  timestamps: true
});

module.exports = Cafe;
