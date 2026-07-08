require("dotenv").config();

const connectDB = require("./db/connectDB");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Order = require("./models/Order");
const mongoose = require("mongoose");

const seedDatabase = async () => {
  try {
    await connectDB();

    // Cleanup order matters: Orders -> Products -> Categories
    // (Products/Categories are referenced by Orders/Products, so we
    // remove the "leaf" dependents first.)
    await Order.deleteMany();
    console.log("Cleared Orders collection");

    await Product.deleteMany();
    console.log("Cleared Products collection");

    await Category.deleteMany();
    console.log("Cleared Categories collection");

    // --- Sample Categories (at least 3) ---
    const categories = await Category.insertMany([
      {
        name: "Electronics",
        description: "Gadgets, devices, and everything electronic",
      },
      {
        name: "Clothing",
        description: "Apparel and fashion for everyone",
      },
      {
        name: "Home & Kitchen",
        description: "Everything for your home and kitchen",
      },
    ]);

    const [electronics, clothing, homeKitchen] = categories;

    // --- Sample Products (at least 6, correct category _id references) ---
    const products = await Product.insertMany([
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling over-ear wireless headphones",
        price: 129.99,
        stock: 25,
        category: electronics._id,
        images: ["https://example.com/images/headphones.jpg"],
      },
      {
        name: "Smart Watch",
        description: "Fitness tracking smart watch with heart-rate monitor",
        price: 199.99,
        stock: 15,
        category: electronics._id,
        images: ["https://example.com/images/smartwatch.jpg"],
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable waterproof Bluetooth speaker",
        price: 59.99,
        stock: 40,
        category: electronics._id,
        images: ["https://example.com/images/speaker.jpg"],
      },
      {
        name: "Men's Cotton T-Shirt",
        description: "Comfortable 100% cotton crew-neck t-shirt",
        price: 19.99,
        stock: 100,
        category: clothing._id,
        images: ["https://example.com/images/tshirt.jpg"],
      },
      {
        name: "Women's Denim Jacket",
        description: "Classic fit denim jacket",
        price: 79.99,
        stock: 30,
        category: clothing._id,
        images: ["https://example.com/images/jacket.jpg"],
      },
      {
        name: "Non-Stick Frying Pan",
        description: "10-inch non-stick frying pan, dishwasher safe",
        price: 34.99,
        stock: 50,
        category: homeKitchen._id,
        images: ["https://example.com/images/pan.jpg"],
      },
      {
        name: "Stainless Steel Knife Set",
        description: "6-piece stainless steel kitchen knife set",
        price: 89.99,
        stock: 20,
        category: homeKitchen._id,
        images: ["https://example.com/images/knives.jpg"],
      },
    ]);

    console.log(
      `Seed complete: added ${categories.length} categories and ${products.length} products.`
    );
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected. Seeding finished.");
  }
};

seedDatabase();
