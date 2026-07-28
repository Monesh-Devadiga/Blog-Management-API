const express = require('express');
const { body } = require('express-validator');
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} = require('../controllers/blogController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

const blogValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];

router.get('/my-blogs', protect, getMyBlogs);

router
  .route('/')
  .get(optionalAuth, getBlogs)
  .post(protect, upload.single('coverImage'), blogValidation, validate, createBlog);

router
  .route('/:id')
  .get(optionalAuth, getBlog)
  .put(protect, upload.single('coverImage'), updateBlog)
  .delete(protect, deleteBlog);

module.exports = router;
