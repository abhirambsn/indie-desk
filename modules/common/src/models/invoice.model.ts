import mongoose, { Schema } from 'mongoose';

const paymentInfoSchema = new Schema({
  method: { type: String, required: true, enum: ['card', 'cheque', 'cash', 'upi', 'bank'] },
  transactionId: { type: String, required: true },
  date: { type: Date, required: true },
  amount: {
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  bankName: { type: String },
  lastFourDigits: { type: String },
  cardType: { type: String },
  chequeNumber: { type: String },
  upiId: { type: String },
});

const invoiceSchema = new Schema(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    client: {
      type: String,
      ref: 'Client',
      required: true,
    },
    project: {
      type: String,
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
    discount: { type: Number, default: 0 },
    paymentInfo: paymentInfoSchema,
  },
  {
    timestamps: true,
  },
);

export const InvoiceModel = mongoose.model('Invoice', invoiceSchema);
