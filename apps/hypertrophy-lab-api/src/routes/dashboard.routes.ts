import { Router } from 'express';
import * as ctrl from '../controllers/dashboard.controller';
import { z } from 'zod';
import { validateQuery } from '../util/zod-express';

const r = Router();

r.get(
  '/summary',
  validateQuery(z.object({ withinDays: z.coerce.number().int().positive().max(365).default(30) })),
  ctrl.getSummary
);

export default r;
