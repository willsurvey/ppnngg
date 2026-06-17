const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ponorogo Cafe API',
      version: '2.0.0',
      description: 'API dokumentasi untuk Ponorogo Cafe Directory - Enterprise Edition. Menyediakan endpoint untuk pencarian cafe, filter, admin management, dan foto.',
      contact: {
        name: 'Wildan Khoiru Rijal Nur Wahid',
        email: 'wildankhoiru816@gmail.com'
      }
    },
    servers: [
      {
        url: '/v1',
        description: 'API v1'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Masukkan token JWT. Contoh: "eyJhbGciOi..." '
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Autentikasi admin' },
      { name: 'Cafe Public', description: 'Endpoint publik untuk cafe' },
      { name: 'Master Data', description: 'Data master (lokasi, kategori, fasilitas)' },
      { name: 'Admin Cafe', description: 'CRUD cafe (butuh auth)' },
      { name: 'Admin Foto', description: 'Kelola foto cafe (butuh auth)' },
      { name: 'Dashboard', description: 'Statistik admin (butuh auth)' }
    ]
  },
  apis: [path.join(__dirname, '..', 'routes', '*.js')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
