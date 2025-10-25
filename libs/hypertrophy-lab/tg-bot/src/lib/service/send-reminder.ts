// libs/tg-bot/src/service/send-reminder.ts
import type { Telegram } from 'telegraf';
import { Markup } from 'telegraf';
import type { Message } from 'telegraf/types';

export type SendReminderInput = {
  chatId: number | string;
  suppName: string;
  doseLabel?: string | null;
  doseUnits?: string | null;
  logId: string;
  images: string[];
};

export async function sendReminder(
  telegram: Telegram,
  it: SendReminderInput,
): Promise<Message.PhotoMessage | Message.TextMessage> {
  console.log('sendreminder images: ', it.images);

  const text =
    `Time to take: ${it.suppName} • ${it.doseLabel ?? it.doseUnits ?? ''}`.trimEnd();
  const kb = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '✅ Take',
        `t:${it.logId}|${encodeURIComponent(it.suppName)}`,
      ),
      Markup.button.callback(
        '⏭ Skip',
        `s:${it.logId}|${encodeURIComponent(it.suppName)}`,
      ),
    ],
  ]);
  if (it.images?.[0]) {
    console.log('images found: ', it.images);

    return telegram.sendPhoto(it.chatId, it.images?.[0] ?? 'test', {
      caption: text,
      reply_markup: kb.reply_markup,
    });
  } else {
    return telegram.sendMessage(it.chatId, text, { reply_markup: kb.reply_markup });
  }
}
