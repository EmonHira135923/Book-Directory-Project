import {Router} from "express"
import { getAllBooksController } from "../controllers/booksController.controller.js";

const router = Router();

router.get("/books",getAllBooksController);

export default router;