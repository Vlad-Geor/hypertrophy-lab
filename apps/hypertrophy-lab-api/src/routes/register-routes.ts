import { Application } from 'express';
import apiRouter from './api.routes.js';

export function registerRoutes(app: Application) {
  app.use('/api/v1', apiRouter);
}
