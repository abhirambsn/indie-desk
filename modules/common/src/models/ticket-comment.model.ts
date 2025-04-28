import mongoose, { Schema } from 'mongoose';

const ticketCommentSchema = new Schema({
  id: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ['internal', 'public'],
    default: 'internal',
    required: true,
  },
  text: { type: String, required: true },
  ticketId: {
    type: String,
    ref: 'SupportTicket',
    required: true,
  },
  projectId: {
    type: String,
    ref: 'Project',
    required: true,
  },
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export const TicketCommentModel = mongoose.model('TicketComment', ticketCommentSchema);
