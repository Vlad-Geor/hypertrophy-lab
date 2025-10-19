import { z } from 'zod';

export const botEnv = z.object({
  BOT_PORT: z.string(),
  TG_BOT_TOKEN: z.string(),
  TG_WEBHOOK_SECRET: z.string(),
  TG_BOT_USERNAME: z.string(),
  TG_PUBLIC_URL: z.string(),
  API_URL: z.string(),
  M2M_AUTH0_DOMAIN: z.string(),
  M2M_AUTH0_CLIENT_ID: z.string(),
  M2M_AUTH0_CLIENT_SECRET: z.string(),
  M2M_AUTH0_AUDIENCE: z.string(),
});
export type BotEnv = z.infer<typeof botEnv>;
