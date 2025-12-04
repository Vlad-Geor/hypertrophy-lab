import { Knex } from 'knex';
import { db } from '../config/database.js';

export type GroupRow = {
  id: string;
  name: string;
  createdBy: string;
  settings: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

export type MembershipRow = {
  groupId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  status: 'invited' | 'active' | 'left';
  joinedAt: Date;
};

export const listUserGroups = (userId: string) =>
  db('core.group_members as gm')
    .innerJoin('core.groups as g', 'g.id', 'gm.group_id')
    .select<GroupRow & { role: MembershipRow['role'] }>({
      id: 'g.id',
      name: 'g.name',
      createdBy: 'g.created_by',
      settings: 'g.settings',
      createdAt: 'g.created_at',
      updatedAt: 'g.updated_at',
      role: 'gm.role',
    })
    .where('gm.user_id', userId)
    .where('gm.status', 'active')
    .orderBy('g.created_at', 'asc');

export const listMembers = (groupId: string) =>
  db('core.group_members as gm')
    .innerJoin('core.users as u', 'u.id', 'gm.user_id')
    .select({
      groupId: 'gm.group_id',
      userId: 'gm.user_id',
      role: 'gm.role',
      status: 'gm.status',
      joinedAt: 'gm.joined_at',
      displayName: 'u.display_name',
      email: 'u.email',
      nickname: 'u.nickname',
      pictureUrl: 'u.picture_url',
    })
    .where('gm.group_id', groupId)
    .orderBy('gm.joined_at', 'asc');

export const findMembership = (userId: string, groupId: string) =>
  db('core.group_members')
    .select<MembershipRow>({
      groupId: 'group_id',
      userId: 'user_id',
      role: 'role',
      status: 'status',
      joinedAt: 'joined_at',
    })
    .where({ user_id: userId, group_id: groupId })
    .first();

export const insertGroupTx = (
  trx: Knex,
  data: { name: string; createdBy: string; settings?: any },
) =>
  trx('core.groups')
    .insert({
      name: data.name,
      created_by: data.createdBy,
      settings: data.settings ?? {},
    })
    .returning<GroupRow[]>([
      'id',
      'name',
      'created_by as createdBy',
      'settings',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);

export const upsertMemberTx = (
  trx: Knex,
  data: {
    groupId: string;
    userId: string;
    role?: MembershipRow['role'];
    status?: MembershipRow['status'];
  },
) =>
  trx('core.group_members')
    .insert({
      group_id: data.groupId,
      user_id: data.userId,
      role: data.role ?? 'member',
      status: data.status ?? 'active',
    })
    .onConflict(['group_id', 'user_id'])
    .merge({
      role: data.role ?? 'member',
      status: data.status ?? 'active',
      joined_at: trx.fn.now(),
    })
    .returning<MembershipRow[]>([
      'group_id as groupId',
      'user_id as userId',
      'role',
      'status',
      'joined_at as joinedAt',
    ]);
