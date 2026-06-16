const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

class AuthService {
  async login(username, password) {
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      const error = new Error('Username atau password salah');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      const error = new Error('Username atau password salah');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 86400 }
    );

    return {
      token,
      expires_in: parseInt(process.env.JWT_EXPIRES_IN, 10) || 86400
    };
  }
}

module.exports = new AuthService();
