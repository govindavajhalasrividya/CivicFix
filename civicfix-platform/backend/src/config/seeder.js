const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/category.model');
const Admin = require('../models/admin.model');

const DEFAULT_CATEGORIES = [
  'Garbage',
  'Broken Street Light',
  'Pothole / Road Damage',
  'Water Leakage',
  'Traffic Issue',
  'Public Toilet Problem',
  'Safety Concern',
  'Stray Animals',
];

const seedCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) return;

  const docs = DEFAULT_CATEGORIES.map((name, i) => ({
    category_id: `CAT_${String(i + 1).padStart(3, '0')}`,
    name,
  }));

  await Category.insertMany(docs);
  console.log('[Seeder] Default categories inserted.');
};

const seedAdmin = async () => {
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) return;

  const password_hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await Admin.create({
    admin_id: `ADM_${uuidv4().slice(0, 8).toUpperCase()}`,
    email: process.env.ADMIN_EMAIL,
    password_hash,
  });
  console.log(`[Seeder] Admin account created: ${process.env.ADMIN_EMAIL}`);
};

const runSeeders = async () => {
  await seedCategories();
  await seedAdmin();
};

module.exports = runSeeders;
