# 📘 Module 13.5: Enterprise MongoDB & Mongoose Integration with TypeScript (MVC Architecture)

In this guide, you will learn how to build a production-grade, type-safe REST API using **Node.js**, **Express v5**, **MongoDB Atlas**, **Mongoose**, **TypeScript Interfaces/Types**, **CORS**, and **dotenv** strictly following the **MVC (Model-View-Controller)** pattern.

---

## 📌 13.5.1 Project Setup & Configuration

### 💻 `package.json`

Ensure your `package.json` includes `"type": "module"` and your current dependency setup:

```json
{
  "name": "node-express-mongoose-typescript",
  "version": "1.0.0",
  "description": "TypeScript REST API with Express, Mongoose, MongoDB Atlas, and MVC Architecture",
  "main": "./dist/server.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node ./dist/server.js",
    "dev": "tsx watch src/server.ts"
  },
  "dependencies": {
    "dotenv": "^17.4.2",
    "mongodb": "^7.5.0",
    "mongoose": "^9.9.3"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/node": "^22.0.0",
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "nodemon": "^3.1.14",
    "tsx": "^4.23.12",
    "typescript": "^5.5.4"
  }
}

```

### 💻 Environment Setup (`.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/product_db?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:3000

```

---

## 📂 Project Architecture (MVC Structure)

```text
src/
├── config/
│   ├── index.config.ts    # Centralized environment variables
│   └── db.ts              # MongoDB Atlas Mongoose connection logic
├── types/
│   └── product.types.ts   # TypeScript Interfaces & Alias Types
├── models/
│   └── product.model.ts   # Mongoose Schema & Typed Model definition
├── controllers/
│   └── product.controller.ts # Business logic & Database CRUD operations
├── routes/
│   └── product.routes.ts  # Express Router mapping paths to controllers
├── middlewares/
│   └── errorHandler.ts    # Global error interceptor
├── app/
│   └── app.ts             # Express app initializations & middleware setup
└── server.ts              # Entry point starting database connection & HTTP server

```

---

## 📌 13.5.2 Code Implementation

### 1️⃣ Interface & Type Aliases (`src/types/product.types.ts`)

Combining **Interfaces** for object shape validation and **Type Aliases** for union types and data constraints:

```typescript
import type { Document } from "mongoose";

// Type Alias for category restriction
export type ProductCategory = "Electronics" | "Clothing" | "Books" | "Home Decor";

// Type Alias for product status
export type ProductStatus = "in-stock" | "out-of-stock" | "discontinued";

// Core Domain Interface
export interface IProduct {
  name: string;
  sku: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  tags?: string[];
  isFeatured?: boolean;
}

// Interface extending Mongoose Document for database instances
export interface IProductDocument extends IProduct, Document {
  createdAt: Date;
  updatedAt: Date;
}

```

---
