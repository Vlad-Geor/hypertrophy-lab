import { healthTargets } from '@ikigaidev/model';
/** @format */

const enumName = 'health_target_enum';

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE TYPE ${enumName} AS ENUM (${healthTargets.map((v) => `'${v}'`).join(',')});`,
  );

  return knex.schema.createTable('supplements', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.specificType('health_targets', `${enumName}[]`);
    table.string('dosage_form');
    table.string('quantity_unit');
    table.string('img_url');
    table.string('brand');
    table.integer('serving_size');
    table.string('recommended_usage');
    table.specificType('purchase_links', 'text[]');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('supplements');
  await knex.raw(`DROP TYPE IF EXISTS ${enumName};`);
}
