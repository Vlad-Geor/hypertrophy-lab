import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.withSchema('nutrition').createTable('schedule_plans', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE');
    t.uuid('user_supplement_id')
      .notNullable()
      .references('id')
      .inTable('nutrition.user_supplements')
      .onDelete('CASCADE');
    t.integer('units_per_dose').notNullable().checkPositive(); // ≥1
    t.text('time_of_day').notNullable();
    t.specificType('days_of_week', 'smallint[]').notNullable();
    t.text('notes').nullable();
    t.boolean('active').notNullable().defaultTo(true);
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(['user_id']);
    t.index(['user_supplement_id']);
  });

  // checks + partial index
  await knex.schema.raw(`
  ALTER TABLE nutrition.schedule_plans
  ADD CONSTRAINT schedule_plans_units_per_dose_chk
    CHECK (units_per_dose >= 1),
  ADD CONSTRAINT schedule_plans_time_of_day_chk
    CHECK (time_of_day IN ('morning','afternoon','evening','bedtime')),
  ADD CONSTRAINT schedule_plans_dows_chk
    CHECK (
      cardinality(days_of_week) > 0
      AND days_of_week <@ ARRAY[0,1,2,3,4,5,6]::smallint[]
    );
`);

  await knex.schema.raw(`
  CREATE INDEX IF NOT EXISTS schedule_plans_user_active_idx
  ON nutrition.schedule_plans (user_id) WHERE active;
`);

  // optional uniqueness (one plan per slot)
  // await knex.raw(`CREATE UNIQUE INDEX schedule_plans_unique_slot ON schedule_plans (user_id, user_supplement_id, time_of_day) WHERE active;`);
}

export async function down(knex: Knex) {
  // drop optional unique if you created it
  // await knex.raw(`DROP INDEX IF EXISTS schedule_plans_unique_slot;`);
  await knex.raw(`DROP INDEX IF EXISTS schedule_plans_user_active_idx;`);
  await knex.schema.withSchema('nutrition').dropTableIfExists('schedule_plans');
}
