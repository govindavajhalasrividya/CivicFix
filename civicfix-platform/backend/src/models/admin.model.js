const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    admin_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
  }
);

// Compare plain password against stored hash
adminSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password_hash);
};

module.exports = mongoose.model('Admin', adminSchema);
