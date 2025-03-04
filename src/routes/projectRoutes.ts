import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router();

router.post('/', ProjectController.createProjects);
router.get('/', ProjectController.getAllProjects);

export default router;