import { createCatalogRequest } from '@ikigaidev/hl/contracts';
import { Request, RequestHandler } from 'express';
import * as svc from '../services/supplement.service';

export const listCatalog: RequestHandler = async (req: Request, res) => {
  const { brandId, targetId, q, includeUser } = req.query as any;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const userId = includeUser ? req.user?.id : undefined;
  res.json(await svc.listCatalog({ brandId, targetId, q, page, limit }, userId));
};

export const getCatalogById: RequestHandler<{ id: string }> = async (req, res) => {
  const data = await svc.getCatalogById(req.params.id);
  if (!data) return res.sendStatus(404);
  res.json(data);
};

export const createCatalog: RequestHandler = async (req: Request, res) => {
  // validate with your zod createCatalogRequest.parse(req.body)
  createCatalogRequest.parse(req.body);
  const result = await svc.createCatalog(req.body, req.user.id);
  res.status(201).json(result);
};

export const updateCatalog: RequestHandler<{ id: string }> = async (
  req: Request,
  res,
) => {
  const rows = await svc.updateOwnCatalog(req.user.id, req.params.id, req.body);
  if (!rows?.length) return res.sendStatus(404);
  res.sendStatus(204);
};

export const deleteCatalog: RequestHandler<{ id: string }> = async (
  req: Request,
  res,
) => {
  const n = await svc.deleteOwnCatalog(req.user.id, req.params.id);
  if (!n) return res.sendStatus(404);
  res.sendStatus(204);
};
