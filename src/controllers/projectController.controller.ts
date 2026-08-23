import type { NextFunction, Request, Response } from "express";

export const projectController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).send("Book Directory Project Running!");
  } catch (err) {
    next(err);
  }
};
