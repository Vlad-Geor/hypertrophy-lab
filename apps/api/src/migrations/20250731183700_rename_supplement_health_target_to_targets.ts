import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('supplements', t =>
        t.renameColumn('health_target', 'health_targets'),
      );
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('supplements', t =>
        t.renameColumn('health_targets', 'health_target'),
      );
}

