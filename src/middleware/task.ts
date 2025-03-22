import type { Request, Response, NextFunction } from 'express';
import Project, { ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask;
        }
    }
}

export async function taskExists(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { taskId } = req.params;
        const task = await Project.findById(taskId);
        if (!task) {
            const error = new Error('Tarea no enontrada');
            res.status(404).json({ error: error.message });
            return;
        }
        req.task = task;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.task.project.toString() !== req.project.id.toString()) {
        res.status(400).json({ error: 'Accion no permitida' });
        return;
    }
    next();
}