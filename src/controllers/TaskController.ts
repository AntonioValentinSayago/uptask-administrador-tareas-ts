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
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static getProjectsTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id }).populate('project');
            res.json(tasks);
        } catch (error) {
            res.status(500).send({ error: 'Hubo un error' });
        }
    }
    static getTaskById = async (req: Request, res: Response) => {
        try {
            if (req.task.project.toString() !== req.project.id) {
                res.status(400).json({ error: 'Accion no permitida' });
                return;
            }
            res.json(req.task);
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
            console.log(error)
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save();
            res.send("Tarea actualizada correctamente");
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
            console.log(error)
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== req.task.id.toString());
            await Promise.allSettled([req.task.deleteOne(), req.project.save()]);

            res.send("Tarea eliminada correctamente");
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' });
            console.log(error)
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            await req.task.save();
            res.send("Estado de la tarea actualizado correctamente");
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error al act' });
        }
    }
}