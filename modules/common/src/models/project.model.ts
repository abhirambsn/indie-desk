import mongoose, { Schema } from 'mongoose';

const projectSchema = new Schema(
  {
    id: { type: String, required: true },
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
      enum: ['ONGOING', 'COMPLETED', 'CANCELLED', 'PENDING'],
      default: 'ONGOING',
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
