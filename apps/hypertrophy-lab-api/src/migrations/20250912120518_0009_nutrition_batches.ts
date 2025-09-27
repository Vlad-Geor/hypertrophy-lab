import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('batches', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    t.uuid('user_supplement_id')
      .notNullable()
      .references('id')
      .inTable('user_supplements')
      .onDelete('CASCADE');

    t.integer('quantity_units').notNullable(); // remaining units in this lot
    t.date('expires_on'); // nullable if unknown
    t.timestamp('received_at', { useTz: true }); // when acquired (optional)
    t.integer('cost_cents'); // optional for COGS

    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // ---- Constraints ----
  await knex.raw(`
        ALTER TABLE batches
        ADD CONSTRAINT batches_qty_ck CHECK (quantity_units >= 0);
      `);

  // ---- Indexes ----
  await knex.raw(`CREATE INDEX batches_us_idx     ON batches (user_supplement_id);`);
  await knex.raw(`CREATE INDEX batches_exp_idx    ON batches (expires_on);`);
  await knex.raw(`
        CREATE INDEX batches_us_exp_idx
          ON batches (user_supplement_id, expires_on);
      `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('batches');
}
