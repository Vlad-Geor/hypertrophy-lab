// repositories/user.repository.ts
import { db } from '../config/database';

const USER_TABLE = 'users';

export default {
  async upsertByTelegramId(data: {
    telegramId: string;
    username: string;
    firstName: string;
    avatar_url: string;
  }) {
    const existing = await db(USER_TABLE).where({ telegram_id: data.telegramId }).first();
    if (existing) {
      await db(USER_TABLE)
        .update({
          username: data.username,
          first_name: data.firstName,
          avatar_url: data.avatar_url,
        })
        .where({ telegram_id: data.telegramId });
      return { ...existing, ...data };
    }
    const [id] = await db(USER_TABLE)
      .insert({
        telegram_id: data.telegramId,
        username: data.username,
        first_name: data.firstName,
        avatar_url: data.avatar_url,
      })
      .returning('id');
    return { id, ...data };
  },
};
