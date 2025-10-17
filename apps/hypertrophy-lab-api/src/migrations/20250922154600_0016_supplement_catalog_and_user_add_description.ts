import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').alterTable('user_supplements', (t) => {
    t.text('description');
  });
  await knex.schema.withSchema('nutrition').alterTable('supplement_catalog', (t) => {
    t.text('description');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').alterTable('user_supplements', (t) => {
    t.dropColumn('description');
  });
  await knex.schema.withSchema('nutrition').alterTable('supplement_catalog', (t) => {
    t.dropColumn('description');
  });
}
