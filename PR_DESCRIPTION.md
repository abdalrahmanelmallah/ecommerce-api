# Pull Request: feature/postman-and-docs → main

## Summary

Completes the E-Commerce Backend API project. This branch adds the final documentation and testing artifacts on top of the already-implemented MVC backend.

## APIs Built

- **Categories API** — GET all, GET by id, POST, PATCH, DELETE (`/api/categories`)
- **Products API** — full CRUD with dynamic filtering by category, price range, stock status, and search (`/api/products`)
- **Cart API** — get cart, add item, update item quantity, remove item, clear cart (`/api/cart`)
- **Orders API** — checkout from cart, get all orders, get order by id, update order status (`/api/orders`)

## What's Included in This PR

- Postman collection (`/postman`) documenting all 22 endpoints across 4 folders, with an environment for `baseUrl`, `categoryId`, `productId`, `orderId`
- Professional `README.md` with setup instructions, environment variable table, endpoint table, and folder structure

## How to Test

1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGO_URI`
3. `npm run seed`
4. `npm run dev`
5. Import the Postman collection + environment from `/postman` and run the requests
