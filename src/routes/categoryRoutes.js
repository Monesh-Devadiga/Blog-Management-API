const express = require('express');
const { body } = require('express-validator');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(
    protect,
    authorize('admin'),
    [body('name').trim().notEmpty().withMessage('Category name is required')],
    validate,
    createCategory
  );

router
  .route('/:id')
  .get(getCategory)
  .put(
    protect,
    authorize('admin'),
    [body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty')],
    validate,
    updateCategory
  )
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
