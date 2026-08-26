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

### 2️⃣ Environment & Database Config (`src/config/index.config.ts` & `src/config/db.ts`)

**`src/config/index.config.ts`**

```typescript
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || "",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
};

```

**`src/config/db.ts`**

```typescript
import mongoose from "mongoose";
import { config } from "./index.config.js";

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongoUri) {
      throw new Error("MONGO_URI is missing in environment variables.");
    }
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

```

---

### 3️⃣ Mongoose Schema & Model (`src/models/product.model.ts`)

```typescript
import { Schema, model } from "mongoose";
import type { IProductDocument } from "../types/product.types.js";

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      enum: ["Electronics", "Clothing", "Books", "Home Decor"],
      required: true,
    },
    status: {
      type: String,
      enum: ["in-stock", "out-of-stock", "discontinued"],
      default: "in-stock",
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = model<IProductDocument>("Product", productSchema);

```

---

### 4️⃣ Controller Logic (`src/controllers/product.controller.ts`)

```typescript
import type { NextFunction, Request, Response } from "express";
import { Product } from "../models/product.model.js";
import type { IProduct } from "../types/product.types.js";

// GET /api/products
export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/products
export const createProduct = async (
  req: Request<{}, {}, IProduct>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id
export const updateProduct = async (
  req: Request<{ id: string }, {}, Partial<IProduct>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ success: false, message: "Product not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

```

---

### 5️⃣ Routes & Express App (`src/routes/product.routes.ts` & `src/app/app.ts`)

**`src/routes/product.routes.ts`**

```typescript
import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;

```

**`src/app/app.ts`**

```typescript
import cors from "cors";
import express, { type Application } from "express";
import { config } from "../config/index.config.js";
import productRouter from "../routes/product.routes.js";
import { errorHandler } from "../middlewares/errorHandler.js";

const app: Application = express();

// Middleware: Enable CORS & JSON Parsing
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/v1", productRouter);

// Global Error Handler
app.use(errorHandler);

export default app;

```

---

### 6️⃣ Entry Server File (`src/server.ts`)

```typescript
import app from "./app/app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/index.config.js";

const startServer = async (): Promise<void> => {
  // Connect to Database first
  await connectDB();

  // Listen for Server Requests
  app.listen(config.port, () => {
    console.log(`🚀 Server listening on http://localhost:${config.port}`);
  });
};

startServer();

```

---

## 📌 13.5.3 Complete Project `README.md` File

Create a complete `README.md` file in your root folder:

```markdown
# 🚀 Node.js + Express + TypeScript + Mongoose (MVC Architecture)

A production-ready RESTful API template built with **Express v5**, **TypeScript**, **Mongoose**, **MongoDB Atlas**, **CORS**, and **Dotenv** following strict MVC architecture and solid design principles.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js v5
- **Database:** MongoDB Atlas via Mongoose ORM
- **Language:** TypeScript
- **Hot-Reloading:** TSX Watcher
- **Middlewares:** CORS, Express JSON, Central Error Handler

---

## 📁 Project Architecture

```text
src/
├── config/         # App & Database configurations
├── types/          # TypeScript interfaces & type aliases
├── models/         # Mongoose schemas and models
├── controllers/    # Request handlers & business logic
├── routes/         # Express endpoint definitions
├── middlewares/    # Custom middlewares (e.g., Error handler)
├── app/            # Express app assembly
└── server.ts       # Application entry point

```

---

## ⚙️ Installation & Setup

### 1. Clone the repository & Install dependencies

```bash
npm install

```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_ORIGIN=http://localhost:3000

```

### 3. Run Development Server

```bash
npm run dev

```

### 4. Build & Start Production

```bash
npm run build
npm start

```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/products` | Retrieve all products |
| `POST` | `/api/v1/products` | Create a new product |
| `GET` | `/api/v1/products/:id` | Get details of a single product |
| `PUT` | `/api/v1/products/:id` | Update an existing product |
| `DELETE` | `/api/v1/products/:id` | Remove a product |

---

## 📝 License

This project is licensed under the [ISC License](https://www.google.com/search?q=LICENSE).