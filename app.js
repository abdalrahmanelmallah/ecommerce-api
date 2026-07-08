// dotenv must be configured first, before anything else touches process.env
require("dotenv").config();

const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./db/connectDB");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// 1. Body parser
app.use(express.json());

// 2. Sanitize request data against NoSQL query injection (before routes)
app.use(mongoSanitize());

// 3. Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "E-Commerce API is running",
    data: null,
  });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 4. 404 handler for unmatched routes
app.use(notFound);

// 5. Central error handler (always last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// 6. Connect to the database, then start listening
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

module.exports = app;
