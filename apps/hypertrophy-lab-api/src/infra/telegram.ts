// apps/api/src/infra/telegram.ts
import { Telegram } from 'telegraf';
import { loadEnv } from '../config/env';
const { TG_BOT_TOKEN } = loadEnv();
export const telegram = new Telegram(TG_BOT_TOKEN);
