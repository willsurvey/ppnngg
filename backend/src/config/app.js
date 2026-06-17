const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('../routes');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://ponorogocafe.id']
    : true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded photos
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// API Routes
app.use('/v1', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
