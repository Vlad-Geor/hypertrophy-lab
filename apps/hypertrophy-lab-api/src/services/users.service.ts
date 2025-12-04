import * as repo from '../repositories/users.repo.js';

export async function list(params: { q?: string; page?: number; limit?: number }) {
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const offset = (page - 1) * limit;

  const [total, items] = await Promise.all([
    repo.countUsers(params.q),
    repo.listUsers({ q: params.q, limit, offset }),
  ]);

  return { items, page: { page, limit, total } };
}

export const getOne = (id: string) => repo.getUserById(id);
export const update = (id: string, patch: repo.UpdateUserInput) => repo.updateUser(id, patch);
export const remove = (id: string) => repo.deleteUser(id);
