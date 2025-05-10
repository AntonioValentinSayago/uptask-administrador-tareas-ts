import type { Request, Response } from 'express';
import Note, { INote } from '../models/Notes';
import { Types } from 'mongoose';
type NoteParams = {
    noteId: Types.ObjectId
}

export class NotesController {
    static createNote = async (req: Request<{},{},INote>, res: Response) => {
        const { content } = req.body;
        const note = new Note();
        note.content = content;
        note.createdBy = req.user.id;
        note.task = req.task.id;

        req.task.notes.push(note.id);

        try {
            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('Nota creada correctamente');
        } catch (error) {
            res.status(500).json({error: "Error al crear la nota"});
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({task: req.task.id})
            res.json(notes);
        } catch (error) {
            res.status(500).json({error: "Error al obtener las notas"});
            
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) : Promise<void> => {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);
        if (!note) {
            const error = new Error('Nota no encontrada');
            res.status(404).json({error: error.message});
            return;
        }

        if(note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('No tienes permiso para eliminar esta nota');
            res.status(403).json({error: error.message});
            return;
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString());

        try {
           await Promise.allSettled([req.task.save(), note.deleteOne()]);
            res.send('Nota eliminada correctamente');
        } catch (error) {
            res.status(500).json({error: 'Error al eliminar la nota'});
        }
    }
}