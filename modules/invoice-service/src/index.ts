/* eslint-disable @typescript-eslint/no-namespace */
import { config } from 'dotenv';
config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { invoiceRouter } from './routes/invoice.routes';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT ?? 3005;
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/iddb';

app.use('/api/v1/invoices', invoiceRouter);

// Setup Health Check route
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'UP', id: 'invoice-service', name: 'Indie Desk Invoice Service' });
});

mongoose.set('toObject', {
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

mongoose.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
    return ret;
  },
});

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Invoice service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
