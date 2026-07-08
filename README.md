# E-Commerce API

**Repository:** https://github.com/abdalrahmanelmallah/ecommerce-api

A complete E-Commerce Backend API built from scratch using the **MVC (Model-View-Controller)** pattern. It provides everything needed to power an online store's backend: category and product management, a shopping cart, and an order checkout flow.

## Features

- Full CRUD for **Categories** and **Products**
- Dynamic, combinable **product filtering** (by category, price range, stock status, and text search)
- **Shopping Cart** with add / update / remove / clear item logic and automatic stock validation
- **Orders & Checkout** flow that converts a cart into an order, calculates totals server-side, and reduces product stock
- Centralized error handling with consistent `{ status, message, data }` JSON responses
- Request sanitization against NoSQL injection
- Database seed script for quick local setup
- Fully documented Postman collection

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — web framework and routing
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling / ODM
- **dotenv** — environment variable management
- **express-mongo-sanitize** — protection against NoSQL query injection
- **express-validator** — request validation

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or a connection string, e.g. MongoDB Atlas)
- npm

## Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/abdalrahmanelmallah/ecommerce-api.git

# 2. Move into the project folder
cd ecommerce-api

# 3. Install dependencies
npm install

# 4. Create your .env file (copy the example and fill in your values)
cp .env.example .env

# 5. Seed the database with sample categories and products
npm run seed

# 6. Start the development server
npm run dev
```

Other available scripts:

| Script         | Description                              |
| -------------- | ----------------------------------------- |
| `npm start`    | Runs the server with plain Node.js        |
| `npm run dev`  | Runs the server with nodemon (auto-reload)|
| `npm run seed` | Seeds the database with sample data       |

## Environment Variables

| Variable     | Description                          | Example                              |
| ------------ | ------------------------------------- | ------------------------------------- |
| `PORT`       | Port the server listens on            | `5000`                                |
| `NODE_ENV`   | Environment mode                      | `development`                         |
| `MONGO_URI`  | MongoDB connection string             | `mongodb://localhost:27017/ecommerce` |

## API Endpoints

### Categories

| Method | URL                     | Description          |
| ------ | ------------------------ | -------------------- |
| GET    | `/api/categories`        | Get all categories   |
| GET    | `/api/categories/:id`    | Get a single category|
| POST   | `/api/categories`        | Create a category    |
| PATCH  | `/api/categories/:id`    | Update a category    |
| DELETE | `/api/categories/:id`    | Delete a category    |

### Products

| Method | URL                    | Description                                                     |
| ------ | ----------------------- | ----------------------------------------------------------------- |
| GET    | `/api/products`         | Get all products (supports `category`, `minPrice`, `maxPrice`, `inStock`, `search` query filters) |
| GET    | `/api/products/:id`     | Get a single product (category populated)                        |
| POST   | `/api/products`         | Create a product (validates category exists)                     |
| PATCH  | `/api/products/:id`     | Update a product                                                  |
| DELETE | `/api/products/:id`     | Delete a product                                                  |

### Cart

| Method | URL                          | Description                          |
| ------ | ----------------------------- | ------------------------------------- |
| GET    | `/api/cart`                   | View the cart (products populated)    |
| POST   | `/api/cart/items`              | Add an item to the cart               |
| PATCH  | `/api/cart/items/:productId`   | Update an item's quantity             |
| DELETE | `/api/cart/items/:productId`   | Remove an item from the cart          |
| DELETE | `/api/cart`                   | Clear the entire cart                 |

### Orders

| Method | URL                        | Description                                      |
| ------ | ---------------------------- | ------------------------------------------------- |
| POST   | `/api/orders`                | Checkout: create an order from the current cart    |
| GET    | `/api/orders`                | Get all orders                                     |
| GET    | `/api/orders/:id`            | Get a single order                                 |
| PATCH  | `/api/orders/:id/status`     | Update an order's status                           |

**Valid order statuses:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

## Project Structure

```
ecommerce-api/
├── config/          # App-level configuration
├── controllers/      # Route handler / business logic
├── db/                # Database connection (connectDB)
├── middleware/       # 404 handler, central error handler
├── models/            # Mongoose schemas (Category, Product, Cart, Order)
├── postman/            # Postman collection + environment
├── routes/             # Express route definitions
├── utils/              # AppError, asyncHandler helpers
├── app.js               # App entry point
├── seed.js               # Database seed script
├── .env.example            # Sample environment variables
├── .gitignore
├── package.json
└── README.md
```

## Testing the API

Import the collection and environment from the `/postman` folder into Postman:

1. `postman/ECommerce-API.postman_collection.json`
2. `postman/ECommerce-API-Dev.postman_environment.json`

Select the **E-Commerce API Dev** environment, then run requests in order (Categories → Products → Cart → Orders) — the collection automatically captures `categoryId`, `productId`, and `orderId` into environment variables as you go.
