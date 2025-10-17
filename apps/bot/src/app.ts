import { buildWebhookHandler, setWebhook } from '@ikigaidev/tg-bot';
import express from 'express';
import { Telegraf } from 'telegraf';

type Env = {
  PORT: string | number;
  TG_BOT_TOKEN: string;
  TG_BOT_USERNAME: string;
  TG_WEBHOOK_SECRET: string;
  TG_PUBLIC_URL: string;
};

export function createApp({ env, bot }: { env: Env; bot: Telegraf }) {
  const app = express();
  app.use(express.json());

  const hook = `/telegram/${env.TG_WEBHOOK_SECRET}`;
  app.get('/telegram/set-webhook', async (_req, res) => {
    const url = env.TG_PUBLIC_URL + hook;
    res.json(
      await setWebhook({ token: env.TG_BOT_TOKEN, url, secret: env.TG_WEBHOOK_SECRET }),
    );
  });

  app.post(
    hook,
    (req, res, next) =>
      req.get('X-Telegram-Bot-Api-Secret-Token') === env.TG_WEBHOOK_SECRET
        ? next()
        : res.sendStatus(401),
    express.json(),
    buildWebhookHandler(bot),
  );

  app.use((req, res, next) => {
    console.log('REQ', req.method, req.path);
    next();
  });

  return app;
}

// const app = express();
// app.use(express.json());

// // startPolling();
// const env = loadEnv();

// const hook = `/telegram/${env.TG_WEBHOOK_SECRET}`;
// console.log('webhook path: ', hook);

// app.get('/telegram/set-webhook', async (_req, res) => {
//   const url = env.TG_PUBLIC_URL + hook;
//   const r = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/setWebhook`, {
//     method: 'POST',
//     headers: { 'content-type': 'application/json' },
//     body: JSON.stringify({ url, secret_token: env.TG_WEBHOOK_SECRET }),
//   });
//   res.json(await r.json());
// });

// app.post(
//   hook,
//   (req, res, next) => {
//     if (req.get('X-Telegram-Bot-Api-Secret-Token') !== env.TG_WEBHOOK_SECRET)
//       return res.sendStatus(401);
//     next();
//   },
//   express.json(),
//   (req, res) =>
//     bot.handleUpdate(req.body, res).catch((e) => {
//       console.error(e);
//       res.sendStatus(500);
//     }),
// );

// export default app;
