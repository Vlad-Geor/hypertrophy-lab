import { Request, RequestHandler } from 'express';
import { z } from 'zod';
import * as svc from '../services/group-inventory.service.js';

const createSupplementSchema = z.object({
  catalogId: z.uuid().optional().nullable(),
  nickname: z.string().max(120).optional().nullable(),
  safetyNotes: z.string().optional().nullable(),
  initialBatch: z
    .object({
      lot: z.string().max(120).optional().nullable(),
      qtyInitial: z.number().positive(),
      qtyRemaining: z.number().nonnegative().optional(),
      units: z.string().min(1).max(24),
      costCents: z.number().int().nonnegative().optional(),
      expiresOn: z.string().optional().nullable(),
      receivedAt: z.string().optional().nullable(),
    })
    .refine(
      (val) =>
        val.qtyRemaining === undefined ||
        val.qtyRemaining <= (val.qtyInitial ?? Number.MAX_SAFE_INTEGER),
      { path: ['qtyRemaining'], message: 'qtyRemaining cannot exceed qtyInitial' },
    )
    .optional(),
});

const updateSupplementSchema = z.object({
  nickname: z.string().max(120).optional().nullable(),
  safetyNotes: z.string().optional().nullable(),
  archivedAt: z.string().optional().nullable(),
});

const batchInputSchema = z
  .object({
    lot: z.string().max(120).optional().nullable(),
    qtyInitial: z.number().positive(),
    qtyRemaining: z.number().nonnegative().optional(),
    units: z.string().min(1).max(24),
    costCents: z.number().int().nonnegative().optional(),
    expiresOn: z.string().optional().nullable(),
    receivedAt: z.string().optional().nullable(),
  })
  .refine(
    (val) =>
      val.qtyRemaining === undefined ||
      val.qtyRemaining <= (val.qtyInitial ?? Number.MAX_SAFE_INTEGER),
    { path: ['qtyRemaining'], message: 'qtyRemaining cannot exceed qtyInitial' },
  );

const updateBatchSchema = z.object({
  lot: z.string().max(120).optional().nullable(),
  qtyInitial: z.number().positive().optional(),
  qtyRemaining: z.number().nonnegative().optional(),
  units: z.string().min(1).max(24).optional(),
  costCents: z.number().int().nonnegative().optional(),
  expiresOn: z.string().optional().nullable(),
  receivedAt: z.string().optional().nullable(),
  archivedAt: z.string().optional().nullable(),
});

const recordConsumptionSchema = z.object({
  groupBatchId: z.uuid(),
  units: z.number().positive(),
  logId: z.uuid().optional().nullable(),
  costApportionedCents: z.number().int().nonnegative().optional(),
});

export const listSupplements: RequestHandler<{ groupId: string }> = async (req: Request, res) => {
  const includeArchived =
    req.query.includeArchived === '1' || req.query.includeArchived === 'true';
  const includeBatches =
    req.query.includeBatches === '1' || req.query.includeBatches === 'true';

  const items = await svc.listSupplements(req.user.id, req.params.groupId, {
    includeArchived,
    includeBatches,
  });
  res.json(items);
};

export const getSupplement: RequestHandler<{ groupId: string; supplementId: string }> = async (
  req: Request,
  res,
) => {
  const item = await svc.getSupplement(req.user.id, req.params.groupId, req.params.supplementId);
  res.json(item);
};

export const createSupplement: RequestHandler<{ groupId: string }> = async (req: Request, res) => {
  const dto = createSupplementSchema.parse(req.body);
  const item = await svc.createSupplement(req.user.id, req.params.groupId, dto);
  res.status(201).json(item);
};

export const patchSupplement: RequestHandler<{ groupId: string; supplementId: string }> = async (
  req: Request,
  res,
) => {
  const dto = updateSupplementSchema.parse(req.body);
  const archivedAt =
    dto.archivedAt === undefined
      ? undefined
      : dto.archivedAt === null
        ? null
        : new Date(dto.archivedAt);
  await svc.updateSupplement(req.user.id, req.params.groupId, req.params.supplementId, {
    nickname: dto.nickname,
    safetyNotes: dto.safetyNotes,
    archivedAt,
  });
  res.sendStatus(204);
};

export const archiveSupplement: RequestHandler<{
  groupId: string;
  supplementId: string;
}> = async (req: Request, res) => {
  await svc.archiveSupplement(req.user.id, req.params.groupId, req.params.supplementId);
  res.sendStatus(204);
};

export const addBatch: RequestHandler<{ groupId: string; supplementId: string }> = async (
  req: Request,
  res,
) => {
  const dto = batchInputSchema.parse(req.body);
  const batch = await svc.addBatch(req.user.id, req.params.groupId, req.params.supplementId, dto);
  res.status(201).json(batch);
};

export const updateBatch: RequestHandler<{ groupId: string; batchId: string }> = async (
  req: Request,
  res,
) => {
  const dto = updateBatchSchema.parse(req.body);
  const batch = await svc.updateBatch(req.user.id, req.params.groupId, req.params.batchId, dto);
  res.json(batch);
};

export const deleteBatch: RequestHandler<{ groupId: string; batchId: string }> = async (
  req: Request,
  res,
) => {
  await svc.deleteBatch(req.user.id, req.params.groupId, req.params.batchId);
  res.sendStatus(204);
};

export const recordConsumption: RequestHandler<{ groupId: string }> = async (req: Request, res) => {
  const dto = recordConsumptionSchema.parse(req.body);
  const result = await svc.recordConsumption(req.user.id, req.params.groupId, dto);
  res.status(201).json(result);
};
