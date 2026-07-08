const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * This is a single-cart implementation (no auth/user model in scope),
 * so we always work with the one Cart document, creating it on first use.
 */
const getOrCreateCart = async () => {
  let cart = await Cart.findOne();
  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }
  return cart;
};

const recalcTotal = (cart) => {
  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

// @desc    Get the cart with populated product details
// @route   GET /api/cart
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne().populate(
    "items.product",
    "name price images inStock"
  );

  if (!cart) {
    cart = await Cart.create({ items: [], totalPrice: 0 });
  }

  res.status(200).json({
    status: "success",
    message: "Cart fetched successfully",
    data: cart,
  });
});

// @desc    Add an item to the cart (or increase qty if it already exists)
// @route   POST /api/cart/items
exports.addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const qty = Number(quantity) || 1;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (product.stock < qty) {
    return next(new AppError("Insufficient stock for this product", 400));
  }

  const cart = await getOrCreateCart();

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.items.push({ product: productId, quantity: qty, price: product.price });
  }

  recalcTotal(cart);
  await cart.save();

  const populatedCart = await cart.populate(
    "items.product",
    "name price images inStock"
  );

  res.status(200).json({
    status: "success",
    message: "Item added to cart successfully",
    data: populatedCart,
  });
});

// @desc    Update the quantity of a cart item
// @route   PATCH /api/cart/items/:productId
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    return next(new AppError("A valid quantity is required", 400));
  }

  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.product.toString() === productId);

  if (!item) {
    return next(new AppError("Item not found in cart", 404));
  }

  if (quantity === 0) {
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  recalcTotal(cart);
  await cart.save();

  const populatedCart = await cart.populate(
    "items.product",
    "name price images inStock"
  );

  res.status(200).json({
    status: "success",
    message: "Cart item updated successfully",
    data: populatedCart,
  });
});

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/items/:productId
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart();

  const itemExists = cart.items.some(
    (i) => i.product.toString() === productId
  );
  if (!itemExists) {
    return next(new AppError("Item not found in cart", 404));
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  recalcTotal(cart);
  await cart.save();

  const populatedCart = await cart.populate(
    "items.product",
    "name price images inStock"
  );

  res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: populatedCart,
  });
});

// @desc    Clear the entire cart
// @route   DELETE /api/cart
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await getOrCreateCart();

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart cleared successfully",
    data: cart,
  });
});
