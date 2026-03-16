const express = require('express')
const router = express.Router()

const categoryService = require('../services/category.service')

router.get('/', async (req, res) => {
  try {

    const categories = await categoryService.getAllCategories()

    res.json({
      success: true,
      data: categories
    })

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    })

  }
})

module.exports = router