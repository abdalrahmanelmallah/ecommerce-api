const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Order item must reference a product"],
    },
    name: {
      type: String,
      required: [true, "Order item name is required"],
    },
    price: {
      type: Number,
      required: [true, "Order item price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Order item quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Order must contain at least one item"],
      validate: {
        validator: (val) => Array.isArray(val) && val.length > 0,
        message: "Order must contain at least one item",
      },
    },
    totalPrice: {
      type: Number,
      required: [true, "Order total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "pending",
    },
    shippingAddress: {
      street: { type: String, required: [true, "Street is required"] },
      city: { type: String, required: [true, "City is required"] },
      state: { type: String, required: [true, "State is required"] },
      zipCode: { type: String, required: [true, "Zip code is required"] },
      country: { type: String, required: [true, "Country is required"] },
    },
  },
  { timestamps: true }
);

// Generate a unique, human-readable order number before validation
orderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
