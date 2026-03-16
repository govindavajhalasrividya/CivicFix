const jwt = require('jsonwebtoken');
const { findAdminByEmail } = require('../repositories/admin.repository');

const adminLogin = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.code = 'INVALID_REQUEST';
    err.status = 400;
    throw err;
  }

  const admin = await findAdminByEmail(email);
  if (!admin) {
    const err = new Error('Invalid credentials.');
    err.code = 'UNAUTHORIZED';
    err.status = 401;
    throw err;
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid credentials.');
    err.code = 'UNAUTHORIZED';
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { sub: admin.email, admin_id: admin.admin_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return { access_token: token };
};

module.exports = { adminLogin };
