import { isoDate } from '@ikigaidev/contracts';
import {
  createLogRequest,
  createPlanRequest,
  updatePlanRequest,
} from '@ikigaidev/hl/contracts';
import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/schedule.controller.js';
import { validateBody, validateQuery } from '../util/zod-express.js';

const r = Router();

// GET /schedule?date=YYYY-MM-DD
r.get('/', validateQuery(z.object({ date: isoDate })), ctrl.getDayView);

r.get('/summary', ctrl.getDaySummary);

// PLANS
r.get('/plans', ctrl.listPlans);
r.post('/plans', validateBody(createPlanRequest), ctrl.createPlan);
r.patch('/plans/:id', validateBody(updatePlanRequest), ctrl.updatePlan);
r.delete('/plans/:id', ctrl.deletePlan);

// LOGS
r.post('/logs', validateBody(createLogRequest), ctrl.createLog);
r.patch('/logs/:id', ctrl.patchLog); // (optional) add schema if you expose fields
r.delete('/logs/:id', ctrl.deleteLog); // (optional)
r.post('/logs/telegram-action', ctrl.telegramAction);

export default r;
