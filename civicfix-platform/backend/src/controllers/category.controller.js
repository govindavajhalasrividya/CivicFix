const categoryService = require('../services/category.service');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/v1/categories
const getCategories = async (req, res) => {
  try {
    const data = await categoryService.getAllCategories();
    return successResponse(res, 'Categories fetched', data);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

// POST /api/v1/categories  — admin only
const createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    return successResponse(res, 'Category created', result, 201);
  } catch (err) {
    return errorResponse(res, err.message, err.code || 'ERROR', err.status || 500);
  }
};

module.exports = { getCategories, createCategory };
