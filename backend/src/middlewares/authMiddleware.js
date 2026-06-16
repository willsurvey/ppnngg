const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Token tidak ditemukan. Silakan login terlebih dahulu.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // Attach decoded admin data to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token sudah kedaluwarsa. Silakan login kembali.'
      });
    }
    return res.status(401).json({
      message: 'Token tidak valid.'
    });
  }
};

module.exports = authMiddleware;
