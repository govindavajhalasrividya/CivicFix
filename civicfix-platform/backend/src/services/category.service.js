const Category = require('../models/category.model')

const getAllCategories = async () => {
  try {
    const categories = await Category.find()
    return categories
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllCategories
}