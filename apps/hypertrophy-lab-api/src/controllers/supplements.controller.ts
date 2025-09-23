import { createCatalogRequest } from '@ikigaidev/hl/contracts';
import { Request, RequestHandler } from 'express';
import { ZodError } from 'zod';
import * as svc from '../services/supplement.service';

// controller
export const listCatalog: RequestHandler = async (req: Request, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(Math.max(Number(req.query.limit ?? 20), 1), 100);

  const includeUser = req.query.includeUser === '1' || req.query.includeUser === 'true';
  const userId = includeUser ? req.user?.id : undefined;

  const { brandId, targetId, q } = req.query as any;

  const result = await svc.listCatalog({ brandId, targetId, q, page, limit }, userId);
  res.json(result);
};

export const getCatalogById: RequestHandler<{ id: string }> = async (req, res) => {
  const data = await svc.getCatalogById(req.params.id);
  if (!data) return res.sendStatus(404);
  res.json(data);
};

export const createCatalog: RequestHandler = async (req: Request, res) => {
  const includeUser = req.query.includeUser === '1' || req.query.includeUser === 'true';
  const userId = includeUser ? req.user?.id : undefined;

  try {
    const dto = createCatalogRequest.parse(req.body);
    const result = await svc.createCatalog(dto, userId);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCatalog: RequestHandler<{ id: string }> = async (
  req: Request,
  res,
) => {
  try {
    const rows = await svc.updateOwnCatalog(req.user.id, req.params.id, req.body);
    if (!rows?.length) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', message: error });
  }
};

export const deleteCatalog: RequestHandler<{ id: string }> = async (
  req: Request,
  res,
) => {
  const n = await svc.deleteOwnCatalog(req.user.id, req.params.id);
  if (!n) return res.sendStatus(404);
  res.sendStatus(204);
};
