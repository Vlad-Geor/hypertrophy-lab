import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema
    .withSchema('nutrition')
    .createTable('schedule_log_consumptions', (t) => {
      t.uuid('log_id')
        .notNullable()
        .references('id')
        .inTable('schedule_logs')
        .onDelete('CASCADE');
      t.uuid('batch_id')
        .notNullable()
        .references('id')
        .inTable('batches')
        .onDelete('CASCADE');
      t.integer('units').notNullable();
      t.primary(['log_id', 'batch_id']);
      t.index(['batch_id']);
    });

  await knex.raw(`
    ALTER TABLE schedule_log_consumptions
      ADD CONSTRAINT schedule_log_consumptions_units_chk CHECK (units >= 0);
  `);
}

export async function down(knex: Knex) {
  await knex.schema
    .withSchema('nutrition')
    .dropTableIfExists('schedule_log_consumptions');
}
