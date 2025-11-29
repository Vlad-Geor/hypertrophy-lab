import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('group_batches', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('group_supplement_id')
      .notNullable()
      .references('id')
      .inTable('nutrition.group_supplements')
      .onDelete('CASCADE');

    t.string('lot', 120).nullable();
    t.decimal('qty_initial', 12, 3).notNullable().checkPositive();
    t.decimal('qty_remaining', 12, 3).notNullable();
    t.string('units', 24).notNullable().defaultTo('unit'); // align with catalog units
    t.integer('cost_cents').notNullable().defaultTo(0).checkPositive();
    t.date('expires_on').nullable();
    t.timestamp('received_at', { useTz: true }).defaultTo(knex.fn.now());
    t.timestamp('archived_at', { useTz: true }).nullable();
    t.timestamps(true, true, true);

    t.index(['group_supplement_id']);
    t.index(['expires_on', 'archived_at']);
  });

  await knex.schema.raw(`
  ALTER TABLE nutrition.group_batches
  ADD CONSTRAINT gb_qty_initial_pos CHECK (qty_initial > 0),
  ADD CONSTRAINT gb_qty_remaining_nonneg CHECK (qty_remaining >= 0),
  ADD CONSTRAINT gb_qty_remaining_lte_initial CHECK (qty_remaining <= qty_initial)
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('group_batches');
}
