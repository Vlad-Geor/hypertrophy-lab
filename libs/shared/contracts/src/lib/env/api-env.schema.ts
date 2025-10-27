import { z } from 'zod';

export const apiEnv = z.object({
  DB_URL: z.string(),
  API_PORT: z.number(),
  TG_PUBLIC_URL: z.string(),
  TG_BOT_TOKEN: z.string(),
  TG_WEBHOOK_SECRET: z.string(),
  TG_BOT_USERNAME: z.string(),
  AUTH0_AUDIENCE: z.string(),
  AUTH0_DOMAIN: z.string(),
  // M2M_AUTH0_DOMAIN: z.string(),
  // M2M_AUTH0_CLIENT_ID: z.string(),
  // M2M_AUTH0_CLIENT_SECRET: z.string(),
  // M2M_AUTH0_AUDIENCE: z.string(),
});
export type ApiEnv = z.infer<typeof apiEnv>;
