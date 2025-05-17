/** @format */

import { Supplement } from '@ikigaidev/hl/model';
import { db } from '../config/database';
import { toSnakeCase } from '../util/snake-case';

const TABLE_NAME = 'supplements';

export class SupplementRepository {
  public async findAll(): Promise<Supplement[]> {
    return db(TABLE_NAME).select('*');
  }

  public async findById(id: number): Promise<Supplement | undefined> {
    return db(TABLE_NAME).where({ id }).first();
  }

  public async create(supplement: Partial<Supplement>): Promise<Supplement> {
    // Inserting returns an array of inserted records. [0] is the first record.
    const [created] = await db(TABLE_NAME).insert(toSnakeCase(supplement)).returning('*');
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
