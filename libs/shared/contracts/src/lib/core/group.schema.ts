import { z } from 'zod';

export const groupSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(120),
  createdBy: z.uuid(),
  settings: z.record(z.string(), z.unknown()).default({}),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Group = z.infer<typeof groupSchema>;

export const groupMemberSchema = z.object({
  groupId: z.uuid(),
  userId: z.uuid(),
  role: z.enum(['owner', 'admin', 'member']),
  status: z.enum(['invited', 'active', 'left']),
  joinedAt: z.string(),
});
export type GroupMember = z.infer<typeof groupMemberSchema>;
