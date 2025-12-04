import { db } from '../config/database.js';
import * as repo from '../repositories/groups.repo.js';
import { httpError } from '../util/http-error.js';

export const listGroups = (userId: string) => repo.listUserGroups(userId);

export async function createGroup(userId: string, payload: { name: string; settings?: Record<string, unknown> }) {
  return db.transaction(async (trx) => {
    const [group] = await repo.insertGroupTx(trx, {
      name: payload.name,
      createdBy: userId,
      settings: payload.settings ?? {},
    });

    await repo.upsertMemberTx(trx, {
      groupId: group.id,
      userId,
      role: 'owner',
      status: 'active',
    });

    return group;
  });
}

export async function listGroupMembers(userId: string, groupId: string) {
  await requireActiveMembership(userId, groupId);
  return repo.listMembers(groupId);
}

export async function addGroupMember(
  requesterId: string,
  groupId: string,
  payload: { userId: string; role?: repo.MembershipRow['role']; status?: repo.MembershipRow['status'] },
) {
  const membership = await requireActiveMembership(requesterId, groupId);
  ensureManager(membership);

  return db.transaction(async (trx) => {
    const [member] = await repo.upsertMemberTx(trx, {
      groupId,
      userId: payload.userId,
      role: payload.role ?? 'member',
      status: payload.status ?? 'active',
    });
    return member;
  });
}

export async function requireActiveMembership(userId: string, groupId: string) {
  const membership = await repo.findMembership(userId, groupId);
  if (!membership || membership.status !== 'active') {
    throw httpError(404, 'Group not found');
  }
  return membership;
}

export function ensureManager(membership: repo.MembershipRow) {
  if (membership.role === 'member') {
    throw httpError(403, 'Insufficient permissions for this group');
  }
}
