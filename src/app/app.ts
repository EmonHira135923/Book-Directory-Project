import express, { type Express } from "express";
import cors from "cors";
import projectRouter from "../routes/project.routes.js";

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Router
app.use("/",projectRouter);

export default app;
