import dotenv from 'dotenv';

dotenv.config();

export function loadEnv() {
  return {
    PORT: parseInt(process.env.PORT || '3333', 10),
    DB_URL: process.env.DATABASE_URL ?? 'postgres://localhost:5432/dev',
    TG_BOT_TOKEN: process.env.TG_BOT_TOKEN ?? '',
    JWT_SECRET: process.env.JWT_SECRET ?? '',
    FRONT_URL: process.env.FRONT_URL ?? '',
  };
}
