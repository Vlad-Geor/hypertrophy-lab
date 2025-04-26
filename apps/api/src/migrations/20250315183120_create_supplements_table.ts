/** @format */

import type { Knex } from 'knex';
import { configDotenv } from 'dotenv';


export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('supplements', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('description');
		table.string('health_target');
		table.string('dosage_form');
		table.string('quantity_unit');
		table.integer('standard_quantity');
		table.string('recommended_usage');
		table.specificType('purchase_links', 'text[]');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists('supplements');
}
