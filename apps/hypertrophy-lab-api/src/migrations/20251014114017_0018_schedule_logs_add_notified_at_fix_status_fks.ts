import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.withSchema('nutrition').alterTable('schedule_logs', (t) => {
    t.dropForeign(['user_supplement_id']);
    t.dropForeign(['plan_id']);
    t.foreign('user_supplement_id').references('id').inTable('nutrition.user_supplements').onDelete('CASCADE');
    t.foreign('plan_id').references('id').inTable('nutrition.schedule_plans').onDelete('SET NULL');
  });

  // status: add 'pending' + default
  await knex.raw(`
    ALTER TABLE nutrition.schedule_logs
      DROP CONSTRAINT IF EXISTS schedule_logs_status_chk,
      ADD CONSTRAINT schedule_logs_status_chk
        CHECK (status IN ('pending','taken','skipped'));
    ALTER TABLE nutrition.schedule_logs
      ALTER COLUMN status SET DEFAULT 'pending';
  `);

  // notified_at + partial index for unsent
  await knex.schema.withSchema('nutrition').alterTable('schedule_logs', (t) => {
    t.timestamp('notified_at', { useTz: true }).nullable();
  });
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS schedule_logs_notify_idx
      ON nutrition.schedule_logs (user_id, date, time_of_day)
      WHERE notified_at IS NULL AND status = 'pending';
  `);
}

export async function down(knex: Knex) {
  await knex.raw(`DROP INDEX IF EXISTS schedule_logs_notify_idx`);
  await knex.schema.withSchema('nutrition').alterTable('schedule_logs', (t) => {
    t.dropColumn('notified_at');
  });
  await knex.raw(`
    ALTER TABLE nutrition.schedule_logs
      DROP CONSTRAINT IF EXISTS schedule_logs_status_chk,
      ADD CONSTRAINT schedule_logs_status_chk
        CHECK (status IN ('taken','skipped'));
    ALTER TABLE nutrition.schedule_logs
      ALTER COLUMN status DROP DEFAULT;
  `);
}
