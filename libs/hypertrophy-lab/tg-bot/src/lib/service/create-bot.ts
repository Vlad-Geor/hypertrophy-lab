// import { ApiEnv } from '@ikigaidev/contracts';
// import { Context, Telegraf } from 'telegraf';
// import { getM2MToken } from '../m2m-token/auth0-m2m.js';
// import { TelegramActionResponse } from '../model/telegram-action-response.schema.js';

// type ClaimResponse = { ok: boolean; error?: string };

// export async function createBot(env: ApiEnv) {
//   const bot = new Telegraf<Context>(env.TG_BOT_TOKEN);
//   const token = await getM2MToken(env);

//   if (!env.TG_BOT_TOKEN) throw new Error('Missing env config for tg-bot');

//   bot.start(async (ctx) => {
//     const code = (ctx.payload || '').trim();
//     if (!code) return ctx.reply('Open the app to link your account.');

//     await ctx.reply('Linking…');

//     let res: Response;
//     try {
//       res = await fetch(`${env.API_URL}/integrations/telegram/claim`, {
//         method: 'POST',
//         headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
//         body: JSON.stringify({ code, telegram_chat_id: ctx.chat.id }),
//       });
//     } catch (err) {
//       console.error('Fetch failed:', err);
//       return ctx.reply('Link failed: network error');
//     }

//     let j: ClaimResponse;
//     try {
//       j = (await res.json()) as ClaimResponse;
//     } catch {
//       return ctx.reply('Link failed: bad response from server');
//     }

//     if (!res.ok || !j.ok) {
//       return ctx.reply('Link failed: ' + (j?.error || res.statusText || 'error'));
//     }

//     return ctx.reply('Linked. You will get reminders here.');
//   });

//   bot.on('callback_query', async (ctx) => {
//     const cq = ctx.callbackQuery;
//     if (!('data' in cq)) return ctx.answerCbQuery('Unsupported Callback');

//     const data = String(cq.data || '');
//     console.log('callbackQ data: ', data);

//     const [action, rest] = data.split(':', 2); // "t:<id>|uriEncoded(suppName)" | "s:<id>|uriEncoded(suppName)"
//     const [id, encName] = (rest ?? '').split('|', 2);

//     const logId = id ?? '';
//     const name = encName ? decodeURIComponent(encName) : undefined;

//     try {
//       const token = await getM2MToken(env);
//       const res = await fetch(`${env.API_URL}/schedule/logs/telegram-action`, {
//         method: 'POST',
//         headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
//         body: JSON.stringify({ action, logId, chatId: ctx.chat?.id }),
//       });
//       const j = (await res.json()) as TelegramActionResponse;
//       if (!res.ok || !j.ok)
//         return ctx.answerCbQuery(j?.error || res.statusText, { show_alert: true });
//       await ctx.answerCbQuery(j.status === 'taken' ? 'Marked taken' : 'Marked skipped', {
//         show_alert: true,
//       });
//       await ctx.editMessageReplyMarkup(undefined); // disable buttons
//       const ts = new Date().toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true,
//         timeZone: 'Asia/Jerusalem',
//       });

//       await ctx.editMessageText(
//         `${j.status === 'taken' ? '✅ Taken — ' : '🚫 Skipped — '}${name} • ${ts}`,
//         { parse_mode: 'HTML' },
//       );
//     } catch (e) {
//       console.error(e);
//       await ctx.answerCbQuery('Error', { show_alert: true });
//     }
//   });

//   return bot;
// }
