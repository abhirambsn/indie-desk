import mongoose, { Schema } from 'mongoose';

const invoiceSchema = new Schema(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    client: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    date: { type: Date, required: true },
    status: { type: String, enum: ['DRAFT', 'SENT', 'PAID'], default: 'DRAFT' },
    generatedBy: { type: String, required: true },
    dueDate: { type: Date, required: true },
    items: [
      {
        id: { type: String, required: true },
        description: { type: String, required: true },
        hours: { type: Number, required: true },
      },
    ],
    owner: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const InvoiceModel = mongoose.model('Invoice', invoiceSchema);
