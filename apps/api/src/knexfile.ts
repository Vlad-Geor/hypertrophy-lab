/** @format */

import type { Knex } from 'knex';
import { loadEnv } from './config/env';

const { DB_URL } = loadEnv();

console.log('> Knex DB_URL = ', DB_URL);

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: './src/migrations',
      extension: 'ts',
    },
    debug: true,
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    debug: false,
  },
};

export default knexConfig;
