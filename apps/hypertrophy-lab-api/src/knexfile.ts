/** @format */

import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { loadEnv } from './config/env.js';

const { DB_URL } = loadEnv();

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    pool: { min: 2, max: 10 },
    connection: {
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
    },
    ...knexSnakeCaseMappers(),
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    debug: true,
  },
  production: {
    client: 'pg',
    pool: { min: 2, max: 10 },
    connection: {
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
    },
    ...knexSnakeCaseMappers(),
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    debug: false,
  },
};

export default knexConfig;
