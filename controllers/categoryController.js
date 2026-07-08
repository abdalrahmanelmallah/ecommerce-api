const Category = require("../models/category.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Categories fetched successfully",
    data: categories,
  });
});

// @desc    Get single category by id
// @route   GET /api/categories/:id
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category fetched successfully",
    data: category,
  });
});

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  const category = await Category.create({ name, description });

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

// @desc    Update a category
// @route   PATCH /api/categories/:id
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
    data: null,
  });
});
