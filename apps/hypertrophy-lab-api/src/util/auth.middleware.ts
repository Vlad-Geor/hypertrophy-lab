import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env';

const { JWT_SECRET } = loadEnv();

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, JWT_SECRET) as any;
    next();
  } catch {
    res.sendStatus(403);
  }
}
