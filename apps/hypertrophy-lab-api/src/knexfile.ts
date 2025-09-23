/** @format */

import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import { loadEnv } from './config/env';

const { DB_URL } = loadEnv();

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    searchPath: ['nutrition', 'core', 'fitness', 'public'],
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
