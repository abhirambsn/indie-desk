import mongoose, { Schema } from 'mongoose';

const clientSchema = new Schema(
  {
    id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    projects: { type: [String], default: [] }, // Array of project ids or names
    type: { type: String, enum: ['INDIVIDUAL', 'ORGANIZATION'], default: 'INDIVIDUAL' },
    owner: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const ClientModel = mongoose.model('Client', clientSchema);
