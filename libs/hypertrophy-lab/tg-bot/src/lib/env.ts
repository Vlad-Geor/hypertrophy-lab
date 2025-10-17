import { z } from 'zod';

const env = z.object({
  TG_BOT_TOKEN: z.string(),
  TG_WEBHOOK_SECRET: z.string(),
  TG_BOT_USERNAME: z.string(),
  TG_PUBLIC_URL: z.string(),
  API_URL: z.string(),
  AUTH0_DOMAIN: z.string(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  AUTH0_AUDIENCE: z.string(),
});
type Env = z.infer<typeof env>;

export const loadEnv = () => env.parse(process.env);
// export const loadEnv = () => process.env as Env;
