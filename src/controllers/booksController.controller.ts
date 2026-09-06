import type { Request, Response, NextFunction } from "express";

export const getAllBooksController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).json({
      success: true,
      message: "All Books Fetched Successfully",
      data: [],
    });
  } catch (err) {
    next(err);
  }
};
