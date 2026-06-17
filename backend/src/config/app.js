const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const logger = require('./logger');
const routes = require('../routes');
const errorHandler = require('../middlewares/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
    }
  }
}));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://ponorogocafe.id']
    : true,
  credentials: true
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak request, coba lagi nanti' }
});
app.use('/v1/', generalLimiter);

// Stricter limiter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan login, coba lagi 15 menit' }
});
app.use('/v1/auth/login', authLimiter);

// Request logging with morgan → winston
const morganStream = {
  write: (message) => logger.info(message.trim(), { type: 'http' })
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: morganStream,
  skip: (req) => req.path.startsWith('/uploads') || req.path === '/health'
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded photos
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Ponorogo Cafe API Docs',
  swaggerOptions: {
    url: '/v1/swagger.json'
  }
}));

// Serve swagger spec as JSON
app.get('/v1/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

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
