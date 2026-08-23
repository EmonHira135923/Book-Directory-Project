import mongoose from "mongoose";
import { config } from "../config/server.config.js";

export async function main() {
  await mongoose.connect(config.DB_PORT as string);
}