import type { Request, Response } from "express";
import Project from "../models/Project";
import e from "express";

export class ProjectController {

    static createProjects = async (req: Request, res: Response) => {

        const project = new Project(req.body);
        console.log(project)
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
            const projects = await Project.find({});
            res.json(projects);
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response): Promise<void> => {
        try {
            const project = await Project.findById(req.params.id).populate("tasks");
            if (!project) {
                const error = new Error("Proyecto no encontrado");
                res.status(404).json({ msg: error });
                return;
            }
            res.json(project);
        } catch (error) {
            console.log(error);
            res.status(500).send("Hubo un error en el servidor");
        }
    }

    static updateProject = async (req: Request, res: Response): Promise<void> => {

        const { id } = req.params;
        try {
            const project = await Project.findById(id, req.body)
            if (!project) {
                const error = new Error("Proyecto no encontrado");
                res.status(404).json({ msg: error });
                return;
            }
            project.clientName = req.body.clientName;
            project.projectName = req.body.projectName;
            project.description = req.body.description;
            await project.save();
            res.send("Proyecto actualizado correctamente");
        } catch (error) {
            console.log(error);
            res.status(500).send("Hubo un error en el servidor");
        }
    }

    static deleteProject = async (req: Request, res: Response): Promise<void> => {

        const { id } = req.params;
        try {
            const project = await Project.findById(id);
            await project.deleteOne();
            if (!project) {
                const error = new Error("Proyecto no encontrado");
                res.status(404).json({ msg: error });
                return;
            }
            res.send("Proyecto eliminado correctamente");
        } catch (error) {
            console.log(error);
            res.status(500).send("Hubo un error en el servidor");
        }
    }
}