import { Request, Response } from 'express';
import { loadEnv } from '../config/env';
import authService from '../services/auth.service';

const { FRONT_URL } = loadEnv();

export async function telegramCallback(req: Request, res: Response) {
  try {
    const { user, jwtToken } = await authService.handleTelegramLogin(req.query);
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 2 * 3600 * 1000,
    });

    res.redirect(`${FRONT_URL}/login-success`);
  } catch (err) {
    console.log(err);

    res.status(403).send('Authentication failed');
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  res.sendStatus(204);
}
