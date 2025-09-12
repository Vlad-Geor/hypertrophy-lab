import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('supplement_catalog', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('brand_id').references('id').inTable('nutrition.brands').onDelete('SET NULL');

    t.string('name').notNullable();
    t.string('form').checkIn([
      'capsule',
      'tablet',
      'softgel',
      'powder',
      'liquid',
      'gummy',
      'spray',
      'drops',
      'other',
    ]);
    t.integer('units_per_container');
    t.string('unit_label').checkIn(['capsule', 'ml', 'mg', 'oz']); // "capsule", "ml"
    t.decimal('serving_units', 10, 2).checkPositive(); // how many units per serving

    t.string('upc');
    t.string('ean');
    t.string('product_url');
    t.jsonb('images').notNullable().defaultTo('[]');
    t.text('safety_notes');

    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(`
        CREATE UNIQUE INDEX IF NOT EXISTS catalog_brand_name_uni
        ON nutrition.supplement_catalog (brand_id, LOWER(name));
      `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('supplement_catalog');
}
