'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_foto_cafe', {
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
      url_foto: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      urutan: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      caption: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tbl_foto_cafe');
  }
};
