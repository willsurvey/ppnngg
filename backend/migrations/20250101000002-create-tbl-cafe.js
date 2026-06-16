'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_cafe', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nama: {
        type: Sequelize.STRING(150),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(160),
        allowNull: false,
        unique: true
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      kecamatan: {
        type: Sequelize.ENUM(
          'Ponorogo', 'Babadan', 'Jenangan', 'Mlarak', 'Siman',
          'Balong', 'Kauman', 'Ngebel', 'Sooko', 'Pulung',
          'Mungkal', 'Slahung', 'Ngrayun', 'Bungkal', 'Sawoo',
          'Sampung', 'Sukorejo', 'Badegan', 'Jambon', 'Pudak'
        ),
        allowNull: true
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      harga_min: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      harga_max: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      jam_buka: {
        type: Sequelize.TIME,
        allowNull: true
      },
      jam_tutup: {
        type: Sequelize.TIME,
        allowNull: true
      },
      buka_24jam: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sesi_buka: {
        type: Sequelize.ENUM('pagi', 'siang', 'sore', 'malam', '24jam'),
        allowNull: true
      },
      suasana: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      instagram: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      google_maps_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      completeness_pct: {
        type: Sequelize.TINYINT,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tbl_cafe');
  }
};
