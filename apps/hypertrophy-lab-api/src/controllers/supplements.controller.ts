import { availableSuppsQuery, createCatalogRequest } from '@ikigaidev/hl/contracts';
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

  try {
    const result = await svc.listCatalog({ brandId, targetId, q, page, limit }, userId);
    res.json(result);
  } catch (err) {
    console.error('Full error:', err);

    const errorResponse = {
      message: 'Internal Server Error',
      error:
        err instanceof Error
          ? {
              message: err.message,
              name: err.name,
              stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
              // Neon/Postgres specific properties
              code: (err as any).code,
              detail: (err as any).detail,
              hint: (err as any).hint,
              position: (err as any).position,
            }
          : String(err),
    };
    res.status(500).json(errorResponse);
  }
};

export const getCatalogById: RequestHandler<{ id: string }> = async (req, res) => {
  const data = await svc.getCatalogById(req.params.id);
  if (!data) return res.sendStatus(404);
  res.json(data);
};

export const getAvailable: RequestHandler = async (req: Request, res) => {
  try {
    const q = availableSuppsQuery.parse(req.query);
    const result = await svc.getAvailableCatalog(req.user.id, q);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createCatalog: RequestHandler = async (req: Request, res) => {
  const includeUser = req.query.includeUser === '1' || req.query.includeUser === 'true';
  const userId = includeUser ? req.user?.id : undefined;
  try {
    const dto = createCatalogRequest.safeParse(req.body);
    if (dto.success) {
      const result = await svc.createCatalog(dto.data, userId);
      res.status(201).json(result);
    } else {
      console.log(dto.data);
    }
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        errors: err.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    res.status(500).json({ error: 'Internal Server Error', message: err });
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
