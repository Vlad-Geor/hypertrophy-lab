import { isoDate } from '@ikigaidev/contracts';
import { Router } from 'express';
import { z } from 'zod';
import * as ctrl from '../controllers/schedule.controller';
import { validateBody, validateQuery } from '../util/zod-express';
import { createLogRequest, createPlanRequest, updatePlanRequest } from '@ikigaidev/hl/contracts';

const r = Router();

// GET /schedule?date=YYYY-MM-DD
r.get('/', validateQuery(z.object({ date: isoDate })), ctrl.getDayView);

// PLANS
r.get('/plans', ctrl.listPlans);
r.post('/plans', validateBody(createPlanRequest), ctrl.createPlan);
r.patch('/plans/:id', validateBody(updatePlanRequest), ctrl.updatePlan);
r.delete('/plans/:id', ctrl.deletePlan);

// LOGS
r.post('/logs', validateBody(createLogRequest), ctrl.createLog);
r.patch('/logs/:id', ctrl.patchLog); // (optional) add schema if you expose fields
r.delete('/logs/:id', ctrl.deleteLog); // (optional)
r.post('/logs/telegram-action', ctrl.telegramActionController)

export default r;
