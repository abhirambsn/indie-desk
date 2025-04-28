/* eslint-disable @typescript-eslint/no-namespace */
import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const getAuthMiddleware = (jwtSecret: string) => {
  const getAuthMiddleware = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const payload = jwt.verify(token, jwtSecret, {
        issuer: 'auth.indie-desk.co',
        audience: 'indie-desk.co',
        ignoreNotBefore: true,
      });

      if (payload instanceof String) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      req.user = payload;
    } catch (err) {
      console.error('[JWT] Error', err);
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    next();
  };

  return getAuthMiddleware;
};
