import mongoose, { Schema, Document, Types } from 'mongoose';

const taskStatus = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    UNDER_REVIEW: 'under_review',
    ON_HOLD: 'on_hold'
} as const;
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus];

export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId,
    status: TaskStatus
}

export const TaskSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    project: { type: Types.ObjectId, ref: 'Project' },
    status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING }
}, { timestamps: true })
const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task