import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').table('users', (t) => {
    t.boolean('email_verified').notNullable().defaultTo(false);
    t.string('display_name');
    t.string('nickname');
    t.string('picture_url');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').table('users', (t) => {
    t.dropColumn('email_verified');
    t.dropColumn('display_name');
    t.dropColumn('nickname');
    t.dropColumn('picture_url');
  });
}
