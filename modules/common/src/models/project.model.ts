import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const projectSchema = new Schema(
  {
    id: { type: String, required: true, default: uuidv4 },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    owner: {
      type: String, // Username of the owner (from external user service)
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId, // Link to Client model
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
    tasks: {
      type: [String],
      default: [],
    },
    users: [
      {
        type: String, // List of usernames who can access the project
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model('Project', projectSchema);
