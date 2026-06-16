const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      message: 'Validasi gagal',
      errors: messages
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Data sudah ada (duplikat)'
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Relasi data tidak valid'
    });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      message: 'Ukuran file terlalu besar (maks 5MB)'
    });
  }

  // Custom API error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Default server error
  res.status(500).json({
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Terjadi kesalahan pada server'
  });
};

module.exports = errorHandler;
