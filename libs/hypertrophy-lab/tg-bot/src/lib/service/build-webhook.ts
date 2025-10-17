import { Telegraf } from "telegraf";
import {Request, Response} from 'express';

export function buildWebhookHandler(bot: Telegraf) {
  return (req: Request, res: Response) =>
    bot.handleUpdate(req.body, res).catch((e) => {
      console.error(e);
      res.sendStatus(500);
    });
}