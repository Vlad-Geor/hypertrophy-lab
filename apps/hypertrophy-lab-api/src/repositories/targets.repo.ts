import { db } from '../config/database';

export const createTarget = async (data: {
  slug: string;
  name: string;
  group: string;
  color?: string | null;
  icon?: string | null;
}) => {
  const [created] = await db('targets')
    .insert({
      slug: data.slug,
      name: data.name,
      group: data.group,
      color: data.color ?? null,
      icon: data.icon ?? null,
    })
    .returning([
      'id',
      'slug',
      'name',
      'group',
      'color',
      'icon',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);
  return created;
};

export const listTargets = () =>
  db('targets')
    .select(
      'id',
      'slug',
      'name',
      'group',
      'color',
      'icon',
      'created_at as createdAt',
      'updated_at as updatedAt',
    )
    .orderBy(['group', 'name']);
