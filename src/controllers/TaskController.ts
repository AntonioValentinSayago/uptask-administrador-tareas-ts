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
    static getTaskById = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findById(taskId);
            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({error: error.message});
                return;
            }
            if(task.project !== req.project.id) {
                res.status(400).json({error: 'Accion no permitida'});
                return;
            }
            res.json(task);
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'});
            console.log(error)
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findById(taskId);
            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({error: error.message});
                return;
            }
            if(task.project !== req.project.id) {
                res.status(400).json({error: 'Accion no permitida'});
                return;
            }
            task.name = req.body.name;
            task.description = req.body.description;
            await task.save();
            res.send("Tarea actualizada correctamente");
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'});
            console.log(error)
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            const task = await Task.findById(taskId, req.body);
            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({error: error.message});
                return;
            }
            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== taskId);
            await Promise.allSettled([task.deleteOne(), req.project.save()]);

            res.send("Tarea eliminada correctamente");
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'});
            console.log(error)
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params;
            
            const task = await Task.findById(taskId);
            if (!task) {
                const error = new Error('Tarea no encontrada');
                res.status(404).json({error: error.message});
                return;
            }
            const { status } = req.body;
            task.status = status;
            await task.save();
            res.send("Estado de la tarea actualizado correctamente");
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'});
        }
    }
}
