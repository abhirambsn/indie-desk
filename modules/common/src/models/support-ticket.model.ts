import mongoose, { Schema } from 'mongoose';

const supportTicketSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    description: { type: String },
    project: {
      type: String,
      ref: 'Project',
      required: true,
    },
    owner: { type: String, required: true },
    assignee: { type: String },
  },
  {
    timestamps: true,
  },
);

export const SupportTicketModel = mongoose.model('SupportTicket', supportTicketSchema);
