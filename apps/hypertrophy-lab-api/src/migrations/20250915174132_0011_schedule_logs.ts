import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.withSchema('nutrition').createTable('schedule_logs', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id').notNullable().references('id').inTable('core.users').onDelete('CASCADE');
    t.uuid('user_supplement_id').notNullable().references('id').inTable('nutrition.user_supplements').onDelete('CASCADE');
    t.uuid('plan_id').nullable().references('id').inTable('nutrition.schedule_plans').onDelete('SET NULL');
    t.date('date').notNullable();
    t.text('time_of_day').notNullable();
    t.text('status').notNullable();
    t.integer('quantity_units').notNullable().defaultTo(0);
    t.text('note').nullable();
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(['user_id', 'user_supplement_id', 'date', 'time_of_day']);
    t.index(['user_id', 'date']);
    t.index(['plan_id']);
  });

  await knex.raw(`
    ALTER TABLE nutrition.schedule_logs
      ADD CONSTRAINT schedule_logs_time_of_day_chk CHECK (time_of_day IN ('morning','afternoon','evening','bedtime')),
      ADD CONSTRAINT schedule_logs_status_chk CHECK (status IN ('taken','skipped')),
      ADD CONSTRAINT schedule_logs_quantity_chk CHECK (quantity_units >= 0);
  `);
}

export async function down(knex: Knex) {
  await knex.schema.withSchema('nutrition').dropTableIfExists('schedule_logs');
}
