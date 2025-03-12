import type { Request, Response } from "express";
import Task from "../models/Task";

export class TaskController {
    static async createTask(req: Request, res: Response) {

        try {
            const task = new Task(req.body);
            task.project = req.project.id;
            req.project.tasks.push(task.id);
            await Promise.allSettled([task.save(), req.project.save()]);
            res.send('Tarea Creada Correctamente');
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static getProjectsTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        } catch (error) {
            res.status(500).send({error: 'Hubo un error'});
        }
    }
}
