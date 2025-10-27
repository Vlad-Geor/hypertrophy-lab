/** @format */

import knex, { Knex } from 'knex';
import knexConfig from '../knexfile.js';

const { NODE_ENV = 'development' } = process.env;

const config = knexConfig[NODE_ENV as 'development' | 'production'];
export const db: Knex = knex(config);

db.on('query-error', (err, q) => {
  console.error('[knex] ERR:', q.sql, q.bindings, err.code);
});
