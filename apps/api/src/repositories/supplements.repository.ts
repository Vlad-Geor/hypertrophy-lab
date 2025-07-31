/** @format */

import { QuantityUnit, Supplement } from '@ikigaidev/hl/model';
import knex from 'knex';
import { db } from '../config/database';

export type APP_MODE = 'Supplementation' | 'Fitness' | 'Dashboard';

export const SEGMENTED_TABLES: Record<APP_MODE & 'Other', string[]> = {
  Dashboard: [],
  Fitness: [
    'WORKOUTS',
    'USER_WORKOUTS',
    'EXERCISES',
    'GOALS',
    'MUSCLE_GROUP',
    'MUSCLE_SUB_GROUP',
  ],
  Supplementation: ['SUPPLEMENTS', 'USER_SUPPLEMENTS'],
  //  TBD
};

export const TABLES = [
  'users',
  'user_supplements',
  'supplement_logs',
  'supplements',
] as const;
export type DbTable = (typeof TABLES)[number];
// export const TABLES: Record<

const TABLE_NAME = 'supplements';

export type AddUserSupplementDto = {
  userId: number;
  supplementId: number;
  stockQuantity: number;
  quantityUnit: QuantityUnit;
  dailyDosage: number | null;
};

export class SupplementRepository {
  public async findAll(): Promise<Supplement[]> {
    return db(TABLE_NAME).select('*');
  }

  public async findById(id: number): Promise<Supplement | undefined> {
    return db(TABLE_NAME).where({ id }).first();
  }

  public async addUserSupplement(options: AddUserSupplementDto): Promise<Supplement> {
    const { dailyDosage, quantityUnit, stockQuantity, supplementId, userId } = options;
    const [row] = await db('user_supplements')
      .insert({
        dailyDosage,
        quantityUnit,
        stockQuantity,
        supplementId,
        userId,
      })
      .onConflict(['user_id', 'supplement_id'])
      .merge({
        stockQuantity: db.raw('?? + ?', ['stock_quantity', stockQuantity]),
        dailyDosage,
        quantityUnit,
        active: true,
        lastRestockedAt: db.fn.now(),
      })
      .returning<Supplement[]>('*');
    return row;
  }

  public async getUserSupplements(userId: number): Promise<Supplement[] | undefined> {
    return knex('user_supplements as us')
      .join('supplements as s', 'us.supplement_id', 's.id')
      .select(
        'us.id',
        'us.stockQuantity',
        'us.quantityUnit',
        'us.dailyDosage',
        's.name',
        's.imgUrl',
        's.healthTargets',
      )
      .where('us.user_id', userId)
      .andWhere('us.active', true)
      .orderBy('s.name');
  }

  public async create(supplement: Partial<Supplement>): Promise<Supplement> {
    // Inserting returns an array of inserted records. [0] is the first record.
    const [created] = await db(TABLE_NAME).insert(supplement).returning('*');
    return created;
  }

  public async update(
    id: number,
    updates: Partial<Supplement>,
  ): Promise<Supplement | undefined> {
    const [updated] = await db(TABLE_NAME).where({ id }).update(updates).returning('*');

    return updated;
  }

  public async delete(id: number): Promise<boolean> {
    const rowsDeleted = await db(TABLE_NAME).where({ id }).del();
    return rowsDeleted > 0;
  }
}
