const Admin = require('../models/admin.model');

const findAdminByEmail = async (email) => {
  return Admin.findOne({ email: email.toLowerCase() });
};

module.exports = { findAdminByEmail };
