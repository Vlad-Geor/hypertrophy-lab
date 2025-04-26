/** @format */

import knex, { Knex } from 'knex';
import config from '../../knexfile';

// Choose an environment, e.g., 'development' or 'production'
const environment = process.env.NODE_ENV || 'development';
export const db: Knex = knex(config[environment]);
