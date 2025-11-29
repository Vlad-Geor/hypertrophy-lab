import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').createTable('groups', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.string('name', 120).notNullable();
    t.uuid('created_by')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('RESTRICT');
    t.jsonb('settings').notNullable().defaultTo('{}'); // e.g., visibility, alerts
    t.timestamps(true, true, true);
  });

  await knex.schema.withSchema('core').createTable('group_members', (t) => {
    t.uuid('group_id')
      .notNullable()
      .references('id')
      .inTable('core.groups')
      .onDelete('CASCADE');
    t.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('core.users')
      .onDelete('CASCADE');

    t.enu('role', ['owner', 'admin', 'member'], {
      useNative: true,
      enumName: 'group_member_role',
    })
      .notNullable()
      .defaultTo('member');

    t.enu('status', ['invited', 'active', 'left'], {
      useNative: true,
      enumName: 'group_member_status',
    })
      .notNullable()
      .defaultTo('active');

    t.timestamp('joined_at', { useTz: true }).defaultTo(knex.fn.now());
    t.unique(['group_id', 'user_id']);
    t.index(['user_id', 'status']);
    t.index(['group_id', 'status']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('core').dropTableIfExists('group_members');
  await knex.raw('DROP TYPE IF EXISTS group_member_status');
  await knex.raw('DROP TYPE IF EXISTS group_member_role');
  await knex.schema.withSchema('core').dropTableIfExists('groups');
}
