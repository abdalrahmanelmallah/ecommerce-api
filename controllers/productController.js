const Product = require("../models/product.model");
const Category = require("../models/category.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Get all products with dynamic, combinable filters
// @route   GET /api/products?category=&minPrice=&maxPrice=&inStock=true&search=
exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, inStock, search } = req.query;
  const filter = {};

  if (category) filter.category = category;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (inStock === "true") filter.inStock = true;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("category", "name description")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Products fetched successfully",
    data: products,
  });
});

// @desc    Get single product by id, with populated category
// @route   GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name description"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product fetched successfully",
    data: product,
  });
});

// @desc    Create a new product (validates category exists first)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, category, images } = req.body;

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return next(new AppError("Category not found", 404));
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    images,
  });

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    data: product,
  });
});

// @desc    Update a product
// @route   PATCH /api/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  if (req.body.category) {
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return next(new AppError("Category not found", 404));
    }
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("category", "name description");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
    data: null,
  });
});
