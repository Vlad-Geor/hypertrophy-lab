import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').createTable('group_supplements', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('group_id')
      .notNullable()
      .references('id')
      .inTable('core.groups')
      .onDelete('CASCADE');
    t.uuid('catalog_id')
      .nullable()
      .references('id')
      .inTable('nutrition.supplement_catalog')
      .onDelete('SET NULL');
    t.string('nickname', 120).nullable(); // per-group display name
    t.text('safety_notes').nullable();
    t.timestamp('archived_at', { useTz: true }).nullable();
    t.timestamps(true, true, true);

    t.index(['group_id']);
    t.index(['group_id', 'archived_at']);
    t.index(['catalog_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('nutrition').dropTableIfExists('group_supplements');
}
