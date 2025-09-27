import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS nutrition;`);

  await knex.schema.withSchema('nutrition').createTable('targets', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('slug').notNullable();
    t.string('name').notNullable();
    t.string('group'); // optional: cluster like "cognition"
    t.string('color'); // hex
    t.string('icon'); // e.g. "heart"
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(`
      CREATE UNIQUE INDEX IF NOT EXISTS targets_slug_uni
      ON targets (LOWER(slug));
    `);

  await knex.raw(`
  ALTER TABLE targets
  ADD CONSTRAINT targets_slug_ck
  CHECK (slug ~ '^[a-z0-9-]+$');
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('targets');
}
