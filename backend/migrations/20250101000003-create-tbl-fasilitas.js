'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_fasilitas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      cafe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tbl_cafe',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      ac: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      wifi: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      toilet: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      mushola: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      ruang_rapat: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      parkir: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      colokan: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('tbl_fasilitas');
  }
};
