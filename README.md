# Learnly App Backend Documentation

## Overview

The Learnly App backend is a Node.js and Express-based API that provides CRUD operations for products, user authentication, and middleware to protect routes. The API integrates with a MongoDB database to store user and product information.

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
  - Request Body: `username`, `email`, `password`
  - Response: JSON object with user details

- **Login**: `POST /api/auth/login`
  - Request Body: `username`, `password`
  - Response: JSON object with user details and authentication token

### Users

- **Get Single User**: `GET /api/users/find/:userId`
  - Request Params: `userId`
  - Response: JSON object with user details

- **Get All Users**: `GET /api/users/`
  - Response: JSON array of user objects

- **Get User Statistics**: `GET /api/users/stats`
  - Response: JSON object with user statistics

### Products

- **Create Product**: `POST /api/products`
  - Request Body: `title`, `description`, `price`, `img`, `categories`, `size`, `color`, `createdBy`
  - Response: JSON object with created product details

- **Get All Products**: `GET /api/products`
  - Response: JSON array of product objects

- **Get Products by Category**: `GET /api/products?category=:category`
  - Request Params: `category`
  - Response: JSON array of product objects filtered by category

- **Get New Products**: `GET /api/products?new=true`
  - Response: JSON array of new product objects

### Orders

- **Create Order**: `POST /api/orders`
  - Request Body: `userId`, `products`, `amount`, `address`, `status`
  - Response: JSON object with created order details

- **Get Income**: `GET /api/orders/income`
  - Response: JSON object with income details

## Database Schema

The Learnly App backend uses MongoDB as its database, with the following schema:

### Cart

- `userId`: String, required
- `products`: Array of objects with `productId` and `quantity`
- `timestamps`: true

### Order

- `userId`: String, required
- `products`: Array of objects with `productId` and `quantity`
- `amount`: Number, required
- `address`: Object, required
- `status`: String, default: "pending"
- `timestamps`: true

### Product

- `title`: String, required, unique
- `description`: String, required
- `price`: Number, required, min: 0
- `img`: String, required
- `categories`: Array
- `size`: String
- `color`: String
- `createdBy`: ObjectId, ref: 'User', required

### User

- `username`: String, required, unique
- `email`: String, required, unique
- `password`: String, required
- `isAdmin`: Boolean, default: false
- `timestamps`: true

## Deployment

The Learnly App backend is deployed on Render.com and can be accessed at `https://learnly-backend-dam0.onrender.com`.