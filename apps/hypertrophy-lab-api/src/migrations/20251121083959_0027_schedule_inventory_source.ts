import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE TYPE inventory_source AS ENUM ('personal','group')`);

  await knex.schema.withSchema('nutrition').table('schedule_plans', (t) => {
    t.specificType('inventory_source', 'inventory_source')
      .notNullable()
      .defaultTo('personal');
    t.uuid('group_id')
      .nullable()
      .references('id')
      .inTable('core.groups')
      .onDelete('SET NULL');
    t.uuid('group_supplement_id')
      .nullable()
      .references('id')
      .inTable('nutrition.group_supplements')
      .onDelete('SET NULL');
    t.index(['inventory_source', 'group_id']);
  });

  await knex.schema.withSchema('nutrition').table('schedule_logs', (t) => {
    t.specificType('inventory_source', 'inventory_source')
      .notNullable()
      .defaultTo('personal');
    t.uuid('group_id')
      .nullable()
      .references('id')
      .inTable('core.groups')
      .onDelete('SET NULL');
    t.uuid('group_supplement_id')
      .nullable()
      .references('id')
      .inTable('nutrition.group_supplements')
      .onDelete('SET NULL');
    t.index(['inventory_source', 'group_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').table('schedule_logs', (t) => {
    t.dropColumns('inventory_source', 'group_id', 'group_supplement_id');
  });
  await knex.schema.withSchema('nutrition').table('schedule_plans', (t) => {
    t.dropColumns('inventory_source', 'group_id', 'group_supplement_id');
  });
  await knex.raw(`DROP TYPE IF EXISTS inventory_source`);
}
