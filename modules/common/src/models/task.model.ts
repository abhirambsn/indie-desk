import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'],
      default: 'OPEN',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    description: { type: String },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    plannedHours: { type: Number },
  },
  {
    timestamps: true,
  },
);

export const TaskModel = mongoose.model('Task', taskSchema);
