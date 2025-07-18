import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();

    table.string('email').unique();
    table.string('password_hash');
    table.string('display_name');
    table.string('avatar_url');

    table.bigInteger('telegram_id').unique().nullable();
    table.string('telegram_username').nullable();
    table.string('telegram_first_name').nullable();
    table.string('telegram_last_name').nullable();
    table.string('telegram_photo_url').nullable();
    table.timestamp('telegram_auth_date').nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
