import { Request, Response } from 'express';
import * as svc from '../services/dashboard.service';
import { dashboardSummaryResponse } from '@ikigaidev/hl/contracts';

export async function getSummary(req: Request, res: Response) {
  const userId = req.user.id;
  const withinDays = Number(req.query.withinDays ?? 30);
  const data = await svc.getSummary({ userId, withinDays });
  const parsed = dashboardSummaryResponse.safeParse(data);
  if (!parsed.success) return res.status(500).json({ error: 'Invalid response', issues: parsed.error.issues });
  res.json(parsed.data);
}
