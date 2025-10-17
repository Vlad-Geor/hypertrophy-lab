// import { Context, Telegraf } from 'telegraf';
// import { loadEnv } from './env';
// import { getM2MToken } from './m2m-token/auth0-m2m';
// import { TelegramActionResponse } from './model/telegram-action-response.model';

// type ClaimResponse = { ok: boolean; error?: string };

// const { TG_BOT_TOKEN, API_URL } = loadEnv();
// if (!TG_BOT_TOKEN || !API_URL) throw new Error('Missing env');

// export const bot = new Telegraf<Context>(TG_BOT_TOKEN);
// const token = await getM2MToken();

// bot.start(async (ctx) => {
//   const code = (ctx.payload || '').trim();
//   if (!code) return ctx.reply('Open the app to link your account.');

//   await ctx.reply('Linking…');

//   let res: Response;
//   try {
//     res = await fetch(`${API_URL}/integrations/telegram/claim`, {
//       method: 'POST',
//       headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
//       body: JSON.stringify({ code, telegram_chat_id: ctx.chat.id }),
//     });
//   } catch (err) {
//     console.error('Fetch failed:', err);
//     return ctx.reply('Link failed: network error');
//   }

//   let j: ClaimResponse;
//   try {
//     j = (await res.json()) as ClaimResponse;
//   } catch {
//     return ctx.reply('Link failed: bad response from server');
//   }

//   if (!res.ok || !j.ok) {
//     return ctx.reply('Link failed: ' + (j?.error || res.statusText || 'error'));
//   }

//   return ctx.reply('Linked. You will get reminders here.');
// });

// bot.on('callback_query', async (ctx) => {
//   const cq = ctx.callbackQuery;
//   if (!('data' in cq)) return ctx.answerCbQuery('Unsupported Callback');

//   const data = String(cq.data || '');
//   console.log('callbackQ data: ', data);

//   const [action, logId] = [data[0], data.slice(2)]; // "t:<id>" | "s:<id>"
//   try {
//     const token = await getM2MToken(); // refresh per call or cache with expiry
//     const res = await fetch(`${API_URL}/schedule/logs/telegram-action`, {
//       method: 'POST',
//       headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
//       body: JSON.stringify({ action, logId, chatId: ctx.chat?.id }),
//     });
//     const j = (await res.json()) as TelegramActionResponse;
//     if (!res.ok || !j.ok)
//       return ctx.answerCbQuery(j?.error || res.statusText, { show_alert: true });
//     await ctx.answerCbQuery(j.status === 'taken' ? 'Marked taken' : 'Marked skipped');
//     await ctx.editMessageReplyMarkup(undefined); // disable buttons
//   } catch (e) {
//     console.error(e);
//     await ctx.answerCbQuery('Error', { show_alert: true });
//   }
// });

// // export async function startPolling() {
// //   await bot.telegram.deleteWebhook({ drop_pending_updates: false }); // ensure polling
// //   const me = await bot.telegram.getMe();
// //   console.log(`Bot @${me.username} starting…`);
// //   bot.on('message', (ctx) => {
// //     if (ctx.message) {
// //       if (ctx.text === 'Скажи арбуз' || ctx.text === 'скажи арбуз') {
// //         ctx.reply('...');
// //       }
// //       if (ctx.text === 'Когда у меня будет секс?') {
// //         ctx.reply('Запрос на секс принят. Звоним Владу.');
// //       } else {
// //         ctx.reply('Ку куууу');
// //       }
// //     }
// //   });

// //   await bot.launch();

// //   process.once('SIGINT', () => bot.stop('SIGINT'));
// //   process.once('SIGTERM', () => bot.stop('SIGTERM'));
// // }
