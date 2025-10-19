import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`CREATE OR REPLACE VIEW nutrition.v_user_supplements AS
SELECT
  us.*,
  sc.name               AS catalog_name,
  br.name               AS brand_name,
  COALESCE(us.nickname, us.custom_name, sc.name, 'Supplement') AS display_name
FROM nutrition.user_supplements us
LEFT JOIN nutrition.supplement_catalog sc ON sc.id = us.catalog_id
LEFT JOIN nutrition.brands br ON br.id = sc.brand_id;`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`DROP VIEW IF EXISTS nutrition.v_user_supplements;
`);
}
