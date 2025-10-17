import { createBot } from '@ikigaidev/tg-bot';
import { createApp } from './app';
import './env';
import { loadEnv } from './env';
const env = loadEnv();

const bot = await createBot(env);
const app = createApp({ env, bot });

// const chatId = '1618478572';
// await bot.telegram.sendMessage(chatId, 'Test', {
//   reply_markup: { inline_keyboard: [[{ text: '✅ Take', callback_data: 't:123' }]] },
// });

app.listen(Number(env.BOT_PORT ?? '8787'), () => {
  console.log(`Bot webhook listening on :${env.BOT_PORT ?? '8787'}`);
  console.log('Call GET /telegram/set-webhook once to register the URL.');
});
