import { Router } from "express";
import { projectController } from "../controllers/projectController.controller.js";


const router = Router();

router.get("/", projectController);

export default router;
