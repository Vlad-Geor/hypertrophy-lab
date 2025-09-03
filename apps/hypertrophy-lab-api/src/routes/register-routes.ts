// apps/api/src/routes/registerRoutes.ts

import { Application } from 'express';
import apiRouter from './api.routes';

export function registerRoutes(app: Application) {
  app.use('/api/v1', apiRouter);
}
