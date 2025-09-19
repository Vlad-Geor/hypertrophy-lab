import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nutrition.user_supplements', (t) => {
    t.jsonb('settings').notNullable().defaultTo(knex.raw(`'{}'::jsonb`));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nutrition.user_supplements', (t) => {
    t.dropColumn('settings');
  });
}
