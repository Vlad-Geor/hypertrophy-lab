import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').createTable('auth_identities', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE');

    t.string('provider').notNullable(); // 'auth0', 'telegram', ...
    t.string('external_id').notNullable(); // e.g. Auth0 sub
    t.string('email'); // optional
    t.jsonb('profile').notNullable().defaultTo('{}');

    t.timestamp('created_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(knex.fn.now());

    t.unique(['provider', 'external_id']);
  });

  await knex.raw(
    `CREATE INDEX IF NOT EXISTS ai_user_idx ON core.auth_identities (user_id);`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').dropTableIfExists('auth_identities');
}
