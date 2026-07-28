const Blog = require('../models/Blog');
const { paginate, buildPaginationResponse } = require('../utils/helpers');

const createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user._id;
    if (req.file) {
      req.body.coverImage = `/uploads/${req.file.filename}`;
    }
    const blog = await Blog.create(req.body);
    const populated = await Blog.findById(blog._id)
      .populate('author', 'name email')
      .populate('category', 'name slug');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    } else {
      filter.status = 'published';
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.author) {
      filter.author = req.query.author;
    }

    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate('author', 'name email')
        .populate('category', 'name slug')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
      pagination: buildPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name slug');

    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    if (!req.user || req.user._id.toString() !== blog.author._id.toString()) {
      blog.viewCount += 1;
      await blog.save();
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this blog');
    }

    if (req.file) {
      req.body.coverImage = `/uploads/${req.file.filename}`;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('author', 'name email')
      .populate('category', 'name slug');

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this blog');
    }

    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getMyBlogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = { author: req.user._id };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
      pagination: buildPaginationResponse(total, page, limit),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, getMyBlogs };
