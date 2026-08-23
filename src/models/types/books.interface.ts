import type { Document } from "mongoose";

// {
//     "title": "The Hitchhiker's Guide to the Galaxy",
//     "author": "Douglas Adams",
//     "description": "Arthur Dent's unlucky day gets worse when his house is demolished, the planet Earth is destroyed, and he is whisked through space.",
//     "genre": "Science Fiction",
//     "publicationYear": 1979,
//     "isbn": "978-0345391803",
//     "price": 8.99,
//     "isAvailable": true
// },

export interface books extends Document {
  title: string;
  author: string;
  description: string;
  genre: string;
  publicationYear: number;
  isbn: string;
  price: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
