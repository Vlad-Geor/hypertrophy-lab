import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nutrition.user_supplements', (t) => {
    t.text('description');
  });
  await knex.schema.alterTable('nutrition.supplement_catalog', (t) => {
    t.text('description');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nutrition.user_supplements', (t) => {
    t.dropColumn('description');
  });
  await knex.schema.alterTable('nutrition.supplement_catalog', (t) => {
    t.dropColumn('description');
  });
}
