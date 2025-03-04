import { Router } from "express";
import { body } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validations";

const router = Router();

router.post('/', 
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es requerido'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es requerida'),
    handleInputErrors,
    ProjectController.createProjects),
router.get('/', ProjectController.getAllProjects);

export default router;