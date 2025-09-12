import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS core;`);

  await knex.schema.withSchema('core').createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('email');                // nullable (socials may lack email)
    t.string('tz').notNullable().defaultTo('UTC');
    t.string('locale').notNullable().defaultTo('en');
    t.jsonb('settings').notNullable().defaultTo('{}');
    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.raw(`
  CREATE UNIQUE INDEX IF NOT EXISTS users_email_ci_uni
    ON core.users (LOWER(email))
    WHERE email IS NOT NULL;
`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').dropTableIfExists('users');
}
