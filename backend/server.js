require('dotenv').config();
const app = require('./src/config/app');
const sequelize = require('./src/config/database');

// Import models to ensure associations are loaded
require('./src/models');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Drop old tables if they exist (migration from old schema)
    const oldTables = ['tbl_foto_cafe', 'tbl_fasilitas', 'tbl_cafe', 'tbl_admin'];
    for (const table of oldTables) {
      try {
        const [results] = await sequelize.query(`SHOW TABLES LIKE '${table}'`);
        if (results.length > 0) {
          await sequelize.query(`DROP TABLE IF EXISTS ${table}`);
          console.log(`Dropped old table: ${table}`);
        }
      } catch (e) {
        // ignore
      }
    }

    // Sync models - use alter in development, migrations in production
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database models synced successfully.');
    }

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API base URL: http://localhost:${PORT}/v1`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
