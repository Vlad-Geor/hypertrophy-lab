import { config } from 'dotenv';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../apps/hypertrophy-lab-api/');
const envPath = join(repoRoot, '.env');

config({ path: envPath, debug: true });

// spot-check a var

export function loadEnv() {
  return {
    PORT: parseInt(process.env.PORT || '3333', 10),
    DB_URL: process.env.DATABASE_URL ?? 'postgres://localhost:5432/dev',
    TG_BOT_TOKEN: process.env.TG_BOT_TOKEN ?? '',
    TG_BOT_USERNAME: process.env.TG_BOT_USERNAME ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    FRONT_URL: process.env.FRONT_URL ?? '',
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE ?? '',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? '',
  };
}
