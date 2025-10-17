import { Request, Response } from 'express';
import { loadEnv } from '../config/env.js';
import { getOrCreateUserFromAuth0 } from '../services/auth.service.js';

const { FRONT_URL } = loadEnv();

export async function getOrCreateAuth0User(req: any, res, next) {
  const ns = 'https://hl.app/';
  try {
    const { sub } = req.auth.payload;
    const email = (req.auth.payload as any)[ns + 'email'] ?? null;
    const emailVerified = (req.auth.payload as any)[ns + 'email_verified'] ?? null;
    const name = (req.auth.payload as any)[ns + 'name'] ?? null;
    const nickname = (req.auth.payload as any)[ns + 'nickname'] ?? null;
    const picture = (req.auth.payload as any)[ns + 'picture'] ?? null;

    const user = await getOrCreateUserFromAuth0({
      sub,
      email,
      emailVerified,
      displayName: name,
      nickname,
      picture,
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
}

// export async function telegramCallback(req: Request, res: Response) {
//   try {
//     const { user, jwtToken } = await authService.handleTelegramLogin(req.query);
//     res.cookie('token', jwtToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: 'lax',
//       maxAge: 2 * 3600 * 1000,
//     });

//     res.redirect(`${FRONT_URL}/login-success`);
//   } catch (err) {
//     res.status(403).send('Authentication failed');
//   }
// }

export function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  res.sendStatus(204);
}
