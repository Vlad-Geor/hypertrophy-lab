import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').createTable('daily_notifications', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE');
    t.date('date').notNullable();
    t.text('type').notNullable(); // e.g., 'morning_summary'
    t.timestamp('sent_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    t.unique(['user_id', 'date', 'type'], { indexName: 'daily_notifications_uk' });
    t.index(['date', 'type'], 'daily_notifications_date_type_idx');
  });

  await knex.raw(`
    ALTER TABLE core.daily_notifications
    ADD CONSTRAINT daily_notifications_type_chk
    CHECK (type IN ('morning_summary'))
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').dropTableIfExists('daily_notifications');
}
