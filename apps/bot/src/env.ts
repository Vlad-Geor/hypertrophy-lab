import { botEnv, BotEnv } from '@ikigaidev/contracts/lib/bot/bot-env.schema';
import { config } from 'dotenv';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../../apps/hypertrophy-lab-api/');
const envPath = join(repoRoot, '.env');

config({ path: envPath, debug: true });

export const loadEnv = (): BotEnv => botEnv.parse(process.env);
