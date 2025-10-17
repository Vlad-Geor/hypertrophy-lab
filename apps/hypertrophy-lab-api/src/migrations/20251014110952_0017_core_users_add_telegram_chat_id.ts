import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').alterTable('users', (t) => {
    t.text('telegram_chat_id').unique().nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').alterTable('users', (t) => {
    t.dropColumn('telegram_chat_id');
  });
}
