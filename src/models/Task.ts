import mongoose, { Schema, Document, Types } from 'mongoose';
import Note from './Notes';

const taskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'inProgress',
    COMPLETED: 'completed',
    UNDER_REVIEW: 'underReview',
    ON_HOLD: 'onHold'
} as const;
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}

export const TaskSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: { type: Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING },
    completedBy: [
        {
            user: { type: Types.ObjectId, ref: 'User', default: null },
            status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING}
        }
    ],
    notes: [{ type: Types.ObjectId, ref: 'Note' }]
}, { timestamps: true })

// Middleware to set the status of the task to 'inProgress' when a user starts working on it
TaskSchema.pre('deleteOne', {document: true}, async function() {
    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({task: taskId})
})

const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task