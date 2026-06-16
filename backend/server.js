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

    // Sync models in development (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database models synced.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API base URL: http://localhost:${PORT}/v1`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
