import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validations";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";

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

router.get('/',
    ProjectController.getAllProjects);

router.get('/:id',
    param('id').isMongoId().withMessage('El id del proyecto no es válido'),
    handleInputErrors,
    ProjectController.getProjectById);

router.put('/:id',
    param('id').isMongoId().withMessage('El id del proyecto no es válido'),
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es requerido'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es requerido'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es requerida'),
    handleInputErrors,
    ProjectController.updateProject);

router.delete('/:id',
    param('id').isMongoId().withMessage('El id del proyecto no es válido'),
    handleInputErrors,
    ProjectController.deleteProject
);

//** Routes for tasks */

router.param('projectId', validateProjectExists);

router.post('/:projectId/tasks',
    body('name')
        .notEmpty().withMessage('El nombre dea la tarea es requerida'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es requerida'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectsTasks
)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id del proyecto no es válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id del proyecto no es válido'),
    body('name')
        .notEmpty().withMessage('El nombre dea la tarea es requerida'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es requerida'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id del proyecto no es válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('El id del proyecto no es válido'),
    body('status')
    .notEmpty().withMessage('El estado de la tarea es requerido'),
    handleInputErrors,
    TaskController.updateStatus
)
export default router;
