const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// @desc    Checkout: create an order from the current cart
// @route   POST /api/orders
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress } = req.body;

  if (!shippingAddress) {
    return next(new AppError("Shipping address is required", 400));
  }

  const cart = await Cart.findOne().populate("items.product");

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  // Validate stock for every item before committing anything
  for (const item of cart.items) {
    if (!item.product) {
      return next(new AppError("A product in your cart no longer exists", 400));
    }
    if (item.product.stock < item.quantity) {
      return next(
        new AppError(`Insufficient stock for ${item.product.name}`, 400)
      );
    }
  }

  // Build order items and calculate totalPrice server-side (never trust client)
  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  // Reduce stock for each purchased product
  for (const item of cart.items) {
    item.product.stock -= item.quantity;
    await item.product.save();
  }

  // Clear the cart after successful checkout
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Orders fetched successfully",
    data: orders,
  });
});

// @desc    Get a single order by id
// @route   GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order fetched successfully",
    data: order,
  });
});

// @desc    Update only the status of an order
// @route   PATCH /api/orders/:id/status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return next(
      new AppError(
        `Status must be one of: ${VALID_STATUSES.join(", ")}`,
        400
      )
    );
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  });
});
