/** @format */

import knex, { Knex } from 'knex';
import knexConfig from '../knexfile';

const { NODE_ENV = 'development' } = process.env;

const config = knexConfig[NODE_ENV as 'development' | 'production'];
export const db: Knex = knex(config);
