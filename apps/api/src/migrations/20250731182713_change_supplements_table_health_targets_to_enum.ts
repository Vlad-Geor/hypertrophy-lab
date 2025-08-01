// 20250720_add_health_target_enum.ts
import { healthTargets } from '@ikigaidev/model';
import { Knex } from 'knex';

const enumName = 'health_target_enum';
const enumValues = healthTargets;

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `DO $$
     BEGIN
       IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${enumName}') THEN
         CREATE TYPE ${enumName} AS ENUM (${enumValues.map((v) => `'${v}'`).join(',')});
       END IF;
     END$$;`,
  );

  await knex.raw(`
    ALTER TABLE supplements
      ALTER COLUMN health_target
      TYPE ${enumName}[]
      USING string_to_array(health_target, ',')::${enumName}[];
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE supplements
      ALTER COLUMN health_target
      TYPE text
      USING array_to_string(health_target, ',');
  `);

  await knex.raw(`DROP TYPE IF EXISTS ${enumName};`);
}
