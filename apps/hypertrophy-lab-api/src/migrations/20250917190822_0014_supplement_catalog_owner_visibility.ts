import type { Knex } from 'knex';

const TABLE = 'nutrition.supplement_catalog';
const VIS_CHK = 'supplement_catalog_visibility_chk';
const OWNER_IDX = 'supplement_catalog_owner_idx';
const VIS_IDX = 'supplement_catalog_visibility_idx';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(TABLE, (t) => {
    t.uuid('owner_user_id')
      .nullable()
      .references('id')
      .inTable('core.users')
      .onDelete('SET NULL');
    t.text('visibility').notNullable().defaultTo('public');
  });

  await knex.raw(`
    ALTER TABLE ${TABLE}
      ADD CONSTRAINT ${VIS_CHK}
      CHECK (visibility IN ('public','private'));
    CREATE INDEX ${OWNER_IDX} ON ${TABLE} (owner_user_id);
    CREATE INDEX ${VIS_IDX} ON ${TABLE} (visibility);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP INDEX IF EXISTS ${OWNER_IDX};
    DROP INDEX IF EXISTS ${VIS_IDX};
    ALTER TABLE ${TABLE} DROP CONSTRAINT IF EXISTS ${VIS_CHK};
  `);

  await knex.schema.alterTable(TABLE, (t) => {
    t.dropColumn('owner_user_id');
    t.dropColumn('visibility');
  });
}
