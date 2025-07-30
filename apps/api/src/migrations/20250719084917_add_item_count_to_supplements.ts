import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('supplements', (t) => {
    t.integer('item_count');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('supplements', (t) => {
    t.dropColumn('item_count');
  });
}
