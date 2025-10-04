import { db } from '../config/database';

export const createBrand = async (data: { name: string; site?: string | null }) => {
  const [created] = await db('nutrition.brands')
    .insert({
      name: data.name,
      site: data.site ?? null,
    })
    .returning([
      'id',
      'name',
      'site',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);
  return created;
};

export const listBrands = () =>
  db('nutrition.brands')
    .select('id', 'name', 'site', 'created_at as createdAt', 'updated_at as updatedAt')
    .orderBy('name', 'asc');
