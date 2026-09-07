import type { Request, Response, NextFunction } from "express";
import { BookModel } from "../models/schema/books.models.js";

// Get All Books
export const getAllBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BookModel.find();
    res.status(200).json({
      success: true,
      message: "All Books Fetched Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Create All Books
export const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await req.body;
    const result = await BookModel.create(data);
    res.status(201).json({
      success: true,
      message: "Book Created Successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update All Books
export const updateAllBookController = async() => {
  try {
    
  } catch (err) {
    next(err);
  }
}
