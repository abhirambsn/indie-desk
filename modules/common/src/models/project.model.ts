import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const projectSchema = new Schema(
  {
    id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    owner: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    perHourRate: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['NEW', 'ONGOING', 'COMPLETED', 'CANCELLED', 'PENDING'],
      default: 'NEW',
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model('Project', projectSchema);
