import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('user_supplements', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    // Ownership
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE');

    // Optional link to global catalog (null => fully custom item)
    t.uuid('catalog_id')
      .references('id')
      .inTable('supplement_catalog')
      .onDelete('SET NULL');

    // Per-user display & thresholds
    t.string('nickname'); // e.g., "Morning D3"
    t.integer('low_stock_threshold_units').notNullable().defaultTo(0);

    // Custom metadata (used when catalog_id is null)
    t.string('custom_name');
    t.string('custom_form'); // capsule/tablet/...
    t.integer('custom_units_per_container');
    t.string('custom_unit_label'); // "capsule","ml","g"
    t.decimal('custom_serving_units', 10, 3);

    // State & timestamps
    t.timestamp('archived_at', { useTz: true });
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // ---- Constraints (Postgres-specific) ----

  // Keep custom_form tidy but flexible (enum-like)
  await knex.raw(`
        ALTER TABLE user_supplements
        ADD CONSTRAINT user_supplements_custom_form_ck
          CHECK (
            custom_form IS NULL OR custom_form IN
            ('capsule','tablet','softgel','powder','liquid','gummy','spray','drops','other')
          );
      `);

  // Threshold must be non-negative
  await knex.raw(`
        ALTER TABLE user_supplements
        ADD CONSTRAINT user_supplements_threshold_ck
          CHECK (low_stock_threshold_units >= 0);
      `);

  // ---- Indexes ----
  await knex.raw(`CREATE INDEX us_user_idx    ON user_supplements (user_id);`);
  await knex.raw(`CREATE INDEX us_catalog_idx ON user_supplements (catalog_id);`);

  // Speed common "active inventory" queries
  await knex.raw(`
        CREATE INDEX us_user_active_partial
          ON user_supplements (user_id)
          WHERE archived_at IS NULL;
      `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('user_supplements');
}
