import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS nutrition;`);

  await knex.schema.withSchema('nutrition').createTable('brands', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name').notNullable();
    t.string('site');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  // case-insensitive unique brand name
  await knex.raw(`
      CREATE UNIQUE INDEX IF NOT EXISTS brands_name_ci_uni
      ON nutrition.brands (LOWER(name));
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.withSchema('nutrition').dropTableIfExists('brands');

}
