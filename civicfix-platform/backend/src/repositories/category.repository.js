const Category = require('../models/category.model');

const findAllCategories = async () => {
  return Category.find({}, { _id: 0, category_id: 1, name: 1 }).sort({ name: 1 });
};

const findCategoryByName = async (name) => {
  return Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
};

const insertCategory = async (data) => {
  const category = new Category(data);
  return category.save();
};

const countCategories = async () => {
  return Category.countDocuments();
};

module.exports = { findAllCategories, findCategoryByName, insertCategory, countCategories };
