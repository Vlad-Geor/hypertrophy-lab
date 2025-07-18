import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_supplements', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('supplement_id')
      .notNullable()
      .references('id')
      .inTable('supplements')
      .onDelete('CASCADE');
    table.decimal('stock_quantity', 10, 2).notNullable().defaultTo(0);
    table.string('quantity_unit').notNullable();
    table.timestamp('last_restocked_at');
    table.decimal('reorder_threshold', 10, 2);
    table.date('next_reorder_date');
    table.decimal('daily_dosage', 10, 2);
    table.boolean('active').notNullable().defaultTo(true);
    table.unique(['user_id', 'supplement_id']);
  });

  await knex.schema.createTable('supplement_logs', (table) => {
    table.increments('id').primary();
    table
      .integer('user_supplement_id')
      .notNullable()
      .references('id')
      .inTable('user_supplements')
      .onDelete('CASCADE');
    table.timestamp('taken_at').notNullable().defaultTo(knex.fn.now());
    table.decimal('amount', 10, 2).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('supplement_logs');
  await knex.schema.dropTableIfExists('user_supplements');
}
