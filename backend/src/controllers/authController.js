const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          message: 'Username dan password wajib diisi'
        });
      }

      const result = await authService.login(username, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    // JWT is stateless - logout is handled client-side by removing token
    // This endpoint exists for API completeness
    res.json({ message: 'Logout berhasil' });
  }
}

module.exports = new AuthController();
