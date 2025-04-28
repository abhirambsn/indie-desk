/* eslint-disable @typescript-eslint/no-namespace */
import { config } from 'dotenv';
config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { clientRouter } from './routes/client.routes';

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

const PORT = process.env.PORT ?? 3001;
const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/iddb';

app.use('/api/v1/clients', clientRouter);

// Setup Health Check route
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'UP', id: 'client-service', name: 'Indie Desk Client Service' });
});

mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Client service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
