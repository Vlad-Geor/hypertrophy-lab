// services/auth.service.ts
import jwt from 'jsonwebtoken';
import { loadEnv } from '../config/env';
import userRepo from '../repositories/user.repository'; // ← your repo
import { verifyTelegram } from '../util/verify-telegram';

const { JWT_SECRET } = loadEnv();

export async function handleTelegramLogin(query: any) {
  const tg = verifyTelegram(query);

  // upsert via repository
  const user = await userRepo.upsertByTelegramId({
    telegramId: tg.id,
    username: tg.username,
    firstName: tg.first_name,
  });

  const jwtToken = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '2h' });

  return { user, jwtToken };
}
export default { handleTelegramLogin };
