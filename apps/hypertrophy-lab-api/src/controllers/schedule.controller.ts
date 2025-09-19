import {
  createLogResponse,
  createPlanResponse,
  dayScheduleResponse,
  listPlansResponse,
} from '@ikigaidev/hl/contracts';
import { Request, Response } from 'express';
import * as svc from '../services/schedule.service';

export async function getDayView(req: Request, res: Response) {
  const userId = req.user.id;
  const date = String(req.query.date);
  const data = await svc.getDayView({ userId, date });
  // runtime guard (dev safety)
  const parsed = dayScheduleResponse.safeParse(data);
  if (!parsed.success)
    return res
      .status(500)
      .json({ error: 'Invalid response shape', issues: parsed.error.issues });
  res.json(parsed.data);
}

export async function listPlans(req: Request, res: Response) {
  const userId = req.user.id;
  const plans = await svc.listPlans({ userId });
  const parsed = listPlansResponse.safeParse(plans);
  if (!parsed.success)
    return res
      .status(500)
      .json({ error: 'Invalid response', issues: parsed.error.issues });
  res.json(parsed.data);
}

export async function createPlan(req: Request, res: Response) {
  const userId = req.user.id;
  const id = await svc.createPlan({ userId, payload: req.body });
  const parsed = createPlanResponse.safeParse({ id });
  if (!parsed.success)
    return res
      .status(500)
      .json({ error: 'Invalid response', issues: parsed.error.issues });
  res.status(201).json(parsed.data);
}

export async function updatePlan(req: Request, res: Response) {
  const userId = req.user.id;
  await svc.updatePlan({ userId, planId: req.params.id, patch: req.body });
  res.sendStatus(204);
}

export async function deletePlan(req: Request, res: Response) {
  const userId = req.user.id;
  await svc.deletePlan({ userId, planId: req.params.id });
  res.sendStatus(204);
}

export async function createLog(req: Request, res: Response) {
  const userId = req.user.id;
  const log = await svc.createLog({ userId, payload: req.body });
  const parsed = createLogResponse.safeParse(log);
  if (!parsed.success)
    return res
      .status(500)
      .json({ error: 'Invalid response', issues: parsed.error.issues });
  res.status(201).json(parsed.data);
}

export async function patchLog(req: Request, res: Response) {
  const userId = req.user.id;
  await svc.patchLog({ userId, logId: req.params.id, patch: req.body });
  res.sendStatus(204);
}

export async function deleteLog(req: Request, res: Response) {
  const userId = req.user.id;
  await svc.deleteLog({ userId, logId: req.params.id });
  res.sendStatus(204);
}
