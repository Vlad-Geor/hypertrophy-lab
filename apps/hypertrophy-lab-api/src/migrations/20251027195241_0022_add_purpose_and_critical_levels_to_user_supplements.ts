import type { Knex } from 'knex';

const PURPOSE_CHECK = `
purpose_category IN (
  'medical_treatment',
  'symptom_or_deficiency_support',
  'baseline_wellness',
  'optimization_performance',
  'situational_acute',
  'experimental'
)
`;

const CRITICALITY_CHECK = `
criticality_level IN ('high','medium','low')
`;

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('nutrition.user_supplements', (t) => {
    t.text('purpose_category').notNullable().defaultTo('baseline_wellness');
    t.text('criticality_level').notNullable().defaultTo('low');
  });
  await knex.raw(
    `ALTER TABLE nutrition.user_supplements
     ADD CONSTRAINT user_supplements_purpose_category_chk
     CHECK (${PURPOSE_CHECK});`,
  );

  await knex.raw(
    `ALTER TABLE nutrition.user_supplements
     ADD CONSTRAINT user_supplements_criticality_level_chk
     CHECK (${CRITICALITY_CHECK});`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    `ALTER TABLE nutrition.user_supplements
     DROP CONSTRAINT IF EXISTS user_supplements_purpose_category_chk;`,
  );

  await knex.raw(
    `ALTER TABLE nutrition.user_supplements
     DROP CONSTRAINT IF EXISTS user_supplements_criticality_level_chk;`,
  );

  await knex.schema.alterTable('nutrition.user_supplements', (t) => {
    t.dropColumn('purpose_category');
    t.dropColumn('criticality_level');
  });
}
