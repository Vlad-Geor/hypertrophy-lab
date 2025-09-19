import {
  addInventoryBulkExistingRequest,
  addInventoryRequest,
} from '@ikigaidev/hl/contracts';
import { Request, RequestHandler } from 'express';
import * as svc from '../services/inventory.service';

export const list: RequestHandler = async (req: Request, res) => {
  const { q, archived } = req.query as any;
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  res.json(
    await svc.list(req.user.id, { q, archived: archived === 'true', page, limit }),
  );
};

export const getOne: RequestHandler<{ id: string }> = async (req: Request, res) => {
  const data = await svc.getOne(req.user.id, req.params.id);
  if (!data) return res.sendStatus(404);
  res.json(data);
};

export const add: RequestHandler = async (req: Request, res) => {
  addInventoryRequest.parse(req.body);
  console.log(req.headers);

  const result = await svc.add(req.user.id, req.body);
  res.status(201).json(result);
};

export const addBulkExisting: RequestHandler = async (req: Request, res, next) => {
  try {
    // console.log('req.body printed: ', req.body);
    // res.status(404).json('Test');
    // return;
    const items = addInventoryBulkExistingRequest.parse(req.body.items);
    const results = await svc.addBulkExisting(req.user.id, items);
    res.status(201).json({ results });
  } catch (e) {
    next(e);
  }
};

export const patch: RequestHandler<{ id: string }> = async (req: Request, res) => {
  await svc.patch(req.user.id, req.params.id, req.body);
  res.sendStatus(204);
};

export const remove: RequestHandler<{ id: string }> = async (req: Request, res) => {
  await svc.archive(req.user.id, req.params.id);
  res.sendStatus(204);
};

// batches
export const addBatch: RequestHandler<{ id: string }> = async (req: Request, res) => {
  const batch = await svc.addBatch(req.params.id, req.body);
  res.status(201).json(batch[0]);
};

export const updateBatch: RequestHandler<{ batchId: string }> = async (
  req: Request,
  res,
) => {
  const batch = await svc.updateBatch(req.params.batchId, req.body);
  res.json(batch[0]);
};

export const deleteBatch: RequestHandler<{ batchId: string }> = async (
  req: Request,
  res,
) => {
  await svc.deleteBatch(req.params.batchId);
  res.sendStatus(204);
};

// helpers
export const lowStock: RequestHandler = async (req: Request, res) => {
  res.json(await svc.lowStock(req.user.id));
};

export const expiringSoon: RequestHandler = async (req: Request, res) => {
  const withinDays = Number(req.query.withinDays ?? 30);
  res.json(await svc.expiringSoon(req.user.id, withinDays));
};
