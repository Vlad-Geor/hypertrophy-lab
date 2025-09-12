import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('catalog_targets', (t) => {
    t.uuid('catalog_id')
      .notNullable()
      .references('id')
      .inTable('nutrition.supplement_catalog')
      .onDelete('CASCADE');
    t.uuid('target_id')
      .notNullable()
      .references('id')
      .inTable('nutrition.targets')
      .onDelete('CASCADE');

    t.primary(['catalog_id', 'target_id']);
  });

  // Helpful lookup indexes
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS ct_catalog_idx ON nutrition.catalog_targets (catalog_id);`,
  );
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS ct_target_idx  ON nutrition.catalog_targets (target_id);`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('catalog_targets');
}
