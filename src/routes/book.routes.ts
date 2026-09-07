import {Router} from "express"
import { createBookController, getAllBooksController } from "../controllers/booksController.controller.js";

const router = Router();

router.get("/books",getAllBooksController);
router.post("/books",createBookController);

export default router;