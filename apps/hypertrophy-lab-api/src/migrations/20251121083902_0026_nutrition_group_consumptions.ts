import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('group_consumptions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('group_batch_id')
      .notNullable()
      .references('id')
      .inTable('nutrition.group_batches')
      .onDelete('RESTRICT');
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('RESTRICT');
    t.uuid('log_id')
      .nullable()
      .references('id')
      .inTable('nutrition.schedule_logs')
      .onDelete('SET NULL');

    t.decimal('units', 12, 3).notNullable(); // deducted units
    t.integer('cost_apportioned_cents').notNullable().defaultTo(0);
    t.timestamp('consumed_at', { useTz: true }).defaultTo(knex.fn.now());
    t.timestamps(true, true, true);

    t.index(['group_batch_id']);
    t.index(['user_id', 'consumed_at']);
  });

  // sanity constraints
  await knex.schema.raw(`
    ALTER TABLE nutrition.group_consumptions
    ADD CONSTRAINT gc_units_pos CHECK (units > 0),
    ADD CONSTRAINT gc_cost_nonneg CHECK (cost_apportioned_cents >= 0)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('group_consumptions');
}
