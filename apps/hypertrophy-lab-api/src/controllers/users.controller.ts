import { Request, RequestHandler } from 'express';
import { z } from 'zod';
import * as svc from '../services/users.service.js';

const updateSchema = z.object({
  email: z.email().nullable().optional(),
  emailVerified: z.boolean().optional(),
  displayName: z.string().min(1).max(120).nullable().optional(),
  nickname: z.string().min(1).max(120).nullable().optional(),
  pictureUrl: z.url().nullable().optional(),
  tz: z.string().min(2).max(64).optional(),
  locale: z.string().min(2).max(10).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const list: RequestHandler = async (req: Request, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  const page = req.query.page ? Number(req.query.page) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  const result = await svc.list({ q, page, limit });
  res.json(result);
};

export const getOne: RequestHandler<{ id: string }> = async (req: Request, res) => {
  const user = await svc.getOne(req.params.id);
  if (!user) return res.sendStatus(404);
  res.json(user);
};

export const update: RequestHandler<{ id: string }> = async (req: Request, res) => {
  const dto = updateSchema.parse(req.body);
  const updated = await svc.update(req.params.id, dto);
  if (!updated) return res.sendStatus(404);
  res.json(updated);
};

export const remove: RequestHandler<{ id: string }> = async (req: Request, res) => {
  const deleted = await svc.remove(req.params.id);
  if (!deleted) return res.sendStatus(404);
  res.sendStatus(204);
};
