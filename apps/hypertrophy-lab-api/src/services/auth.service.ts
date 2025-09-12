// services/auth.service.ts
import { loadEnv } from '../config/env';
import { Claims, upsertUserFromAuth0 } from '../repositories/users.repository'; // ← your repo

const { JWT_SECRET } = loadEnv();

// export async function handleTelegramLogin(query: any) {
//   const tg = verifyTelegram(query);
//   console.log(tg);

//   // upsert via repository
//   const user = await userRepo.upsertByTelegramId({
//     telegramId: tg.id,
//     username: tg.username,
//     firstName: tg.first_name,
//     avatar_url: tg.photo_url,
//   });

//   const jwtToken = jwt.sign({ uid: user.id }, JWT_SECRET, { expiresIn: '2h' });

//   return { user, jwtToken };
// }

export async function getOrCreateUserFromAuth0(claims: Claims) {
  const row = await upsertUserFromAuth0(claims);
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    nickname: row.nickname,
    picture: row.pictureUrl,
    tz: row.tz,
    locale: row.locale,
    settings: row.settings,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export default { getOrCreateUserFromAuth0 };
