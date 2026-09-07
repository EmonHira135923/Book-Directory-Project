import { model, Schema } from "mongoose";
import type { books } from "../types/books.interface.js";

//   title: string;
//   author: string;
//   description: string;
//   genre: string;
//   publicationYear: number;
//   isbn: string;
//   price: number;
//   isAvailable: boolean;
//   createdAt: Date;
//   updatedAt: Date;

const bookSchema = new Schema<books>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    isbn: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isAvailable: Boolean,
  },
  {
    timestamps: true,
  },
);

export const BookModel = model<books>("Book", bookSchema);
