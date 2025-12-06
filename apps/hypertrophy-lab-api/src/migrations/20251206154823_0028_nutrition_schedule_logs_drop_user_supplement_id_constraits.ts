import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1) Allow NULLs
  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_plans
      ALTER COLUMN user_supplement_id DROP NOT NULL;
  `);

  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_logs
      ALTER COLUMN user_supplement_id DROP NOT NULL;
  `);

  // 2) Drop old NOT NULL-style constraints (note the quotes: names start with digits)
  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_plans
      DROP CONSTRAINT IF EXISTS "319488_385318_3_not_null";
  `);

  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_logs
      DROP CONSTRAINT IF EXISTS "319488_385346_3_not_null";
  `);

  // 3) (optional but recommended) reset plans check for inventory_source
  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_plans
      DROP CONSTRAINT IF EXISTS schedule_plans_inventory_source_check;
  `);

  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_plans
      ADD CONSTRAINT schedule_plans_inventory_source_check
      CHECK (
        (inventory_source = 'personal'
          AND user_supplement_id IS NOT NULL
          AND group_supplement_id IS NULL
          AND group_id IS NULL)
        OR
        (inventory_source = 'group'
          AND user_supplement_id IS NULL
          AND group_supplement_id IS NOT NULL
          AND group_id IS NOT NULL)
      );
  `);

  // 4) New “either user OR group” constraint for logs
  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_logs
      ADD CONSTRAINT schedule_logs_owner_check
      CHECK (
        -- user-based log
        (user_supplement_id IS NOT NULL
          AND group_id IS NULL
          AND group_supplement_id IS NULL)
        OR
        -- group-based log
        (user_supplement_id IS NULL
          AND group_id IS NOT NULL
          AND group_supplement_id IS NOT NULL)
      );
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop new checks
  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_logs
      DROP CONSTRAINT IF EXISTS schedule_logs_owner_check;
  `);

  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_plans
      DROP CONSTRAINT IF EXISTS schedule_plans_inventory_source_check;
  `);

  // Re-enforce NOT NULL (simple rollback; you can also recreate old check constraints if you really need symmetry)
  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_plans
      ALTER COLUMN user_supplement_id SET NOT NULL;
  `);

  await knex.schema.raw(`
    ALTER TABLE nutrition.schedule_logs
      ALTER COLUMN user_supplement_id SET NOT NULL;
  `);
}
