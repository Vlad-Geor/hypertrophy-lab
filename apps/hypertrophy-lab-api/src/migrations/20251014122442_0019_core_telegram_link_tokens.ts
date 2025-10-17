import type { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.withSchema('core').createTable('telegram_link_tokens', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable()
      .references('id').inTable('core.users').onDelete('CASCADE');
    t.text('code').notNullable().unique();           // 8–16 chars
    t.timestamp('expires_at', { useTz: true }).notNullable();
    t.timestamp('used_at', { useTz: true }).nullable();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    t.index(['user_id']);
    t.index(['expires_at']);
    t.index(['used_at']);
  });
}

export async function down(knex: Knex) {
  await knex.schema.withSchema('core').dropTableIfExists('telegram_link_tokens');
}
