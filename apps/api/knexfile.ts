/** @format */

import type { Knex } from 'knex';
require('dotenv').config();

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'pg',
		connection: {
			connectionString: process.env.DATABASE_URL,
			ssl: { rejectUnauthorized: false },
		},
		migrations: {
			directory: './src/migrations',
		},
		debug: true,
	},
};

export default config;
