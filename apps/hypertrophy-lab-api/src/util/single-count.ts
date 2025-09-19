import type { Knex } from 'knex';

type CountRow = { cnt: string | number | bigint | null };

export function toNumber(v: unknown): number {
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return Number(v);
  return 0;
}

async function singleCount(qb: Knex.QueryBuilder<any, CountRow[]>) {
  const row = await qb.first<CountRow>();
  return toNumber(row?.cnt ?? 0);
}
