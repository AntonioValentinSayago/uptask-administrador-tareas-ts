import type { Request, Response } from "express";
import Project from "../models/Project";
import e from "express";

export class ProjectController {

    static createProjects = async (req: Request, res: Response) => {

        const project = new Project(req.body);

        // Asignar el usuario que crea el proyecto
        project.manager = req.user.id;

        try {
            await project.save();
            // await Project.create(req.body);  Otra forma de como guardar un proyecto
            res.send("Proyecto Creado Correctamente");
        } catch (error) {
            console.log(error);
        }

    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                // ! Validar el rol del usuario
                $or: [
                    { manager: { $in: req.user._id } },
                    { team: { $in: req.user._id } }
                ]
            });
            res.json(projects);
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({ error: error.message })
                return;
            }
            if (project.manager.toString() !== req.user.id.toString()
                && !project.team.indexOf(req.user.id) // * Validar si el usuario es parte del equipo
            ) {
                const error = new Error('Acción no válida')
                res.status(404).json({ error: error.message })
                return
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response): Promise<void> => {

        const { id } = req.params;
        try {
            const project = await Project.findById(id)
            if (!project) {
                const error = new Error("Proyecto no encontrado");
                res.status(404).json({ error: error.message });
                return;
            }
            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida - Manager no válido')
                res.status(404).json({ error: error.message })
                return
            }

            project.clientName = req.body.clientName;
            project.projectName = req.body.projectName;
            project.description = req.body.description;
            await project.save();
            res.send("Proyecto actualizado correctamente");
        } catch (error) {
            console.log(error);
        }
    }

    static deleteProject = async (req: Request, res: Response): Promise<void> => {

        const { id } = req.params;
        try {
            const project = await Project.findById(id);
            if (!project) {
                const error = new Error("Proyecto no encontrado");
                res.status(404).json({ msg: error });
                return;
            }

            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida - Manager no válido')
                res.status(404).json({ error: error.message })
                return
            }

            await project.deleteOne();
            res.send("Proyecto eliminado correctamente");
        } catch (error) {
            console.log(error);
            res.status(500).send("Hubo un error en el servidor");
        }
    }
}