import { config } from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../.env') });

// config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const Env = z.object({
  PORT: z.string().default('8787'),
  TG_BOT_TOKEN: z.string(),
  TG_BOT_USERNAME: z.string().optional().default(''),
  TG_WEBHOOK_SECRET: z.string(),
  TG_PUBLIC_URL: z.url(),
  API_URL: z.url(),
  AUTH0_AUDIENCE: z.string(),
  AUTH0_DOMAIN: z.string(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
});
export type Env = z.infer<typeof Env>;

export const loadEnv = (): Env => Env.parse(process.env);
