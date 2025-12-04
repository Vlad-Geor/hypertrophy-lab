import { Request, RequestHandler } from 'express';
import { z } from 'zod';
import * as svc from '../services/groups.service.js';

const createGroupSchema = z.object({
  name: z.string().min(1).max(120),
  settings: z.record(z.string(), z.unknown()).optional(),
});

const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['owner', 'admin', 'member']).optional(),
  status: z.enum(['invited', 'active', 'left']).optional(),
});

export const listGroups: RequestHandler = async (req: Request, res) => {
  const groups = await svc.listGroups(req.user.id);
  res.json(groups);
};

export const createGroup: RequestHandler = async (req: Request, res) => {
  const dto = createGroupSchema.parse(req.body);
  const group = await svc.createGroup(req.user.id, dto);
  res.status(201).json(group);
};

export const listMembers: RequestHandler<{ groupId: string }> = async (req: Request, res) => {
  const members = await svc.listGroupMembers(req.user.id, req.params.groupId);
  res.json(members);
};

export const addMember: RequestHandler<{ groupId: string }> = async (req: Request, res) => {
  const dto = addMemberSchema.parse(req.body);
  const member = await svc.addGroupMember(req.user.id, req.params.groupId, dto);
  res.status(201).json(member);
};
