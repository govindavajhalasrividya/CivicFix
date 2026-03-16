const { adminLogin } = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/v1/admin/login
const login = async (req, res) => {
  try {
    const result = await adminLogin(req.body);
    return successResponse(res, 'Login successful', result);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

module.exports = { login };
