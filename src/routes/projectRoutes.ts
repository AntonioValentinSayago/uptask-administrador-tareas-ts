import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validations";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamMemberController";
import { NotesController } from "../controllers/NotesController";

const router = Router();

router.use(authenticate); // Middleware to authenticate all routes

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

//** Routes for tasks */
router.param('projectId', projectExists);

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

router.post('/:projectId/tasks',
    hasAuthorization,
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

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject) // Middeware taskBelongsToProject

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El id del proyecto no es válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('El id del proyecto no es válido'),
    body('name')
        .notEmpty().withMessage('El nombre dea la tarea es requerida'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es requerida'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
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

/** Routes for teams */
router.post('/:projectId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:projectId/team',
    TeamMemberController.getProjecTeam
)

router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Nots */
router.post('/:projectId/tasks/:taskId/notes',
    body('content')
        .notEmpty().withMessage('El contenido de la nota es requerido'),
    handleInputErrors,
    NotesController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NotesController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NotesController.deleteNote
)

export default router;