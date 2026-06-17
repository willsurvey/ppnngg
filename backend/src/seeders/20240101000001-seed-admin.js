'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('admin123', 10);
    const now = new Date();

    await queryInterface.bulkInsert('admin', [
      {
        username: 'admin',
        password: password,
        role: 'superadmin',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('admin', null, {});
  }
};
