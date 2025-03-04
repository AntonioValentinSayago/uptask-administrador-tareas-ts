import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {

    static createProjects = async (req: Request, res: Response) => {
        
        const project = new Project(req.body);
        try {
            await project.save();
            res.send("Proyecto Creado Correctamente");
        } catch (error) {
            console.log(error);
            res.status(500).send("Hubo un error en el servidor");
        }

    }

    static getAllProjects = async (req: Request, res: Response) => {
        res.send("Get all projects");
    }
}