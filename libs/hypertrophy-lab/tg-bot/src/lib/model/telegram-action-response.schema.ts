export type TelegramActionResponse = {
  ok: boolean;
  status?: 'taken' | 'skipped' | 'pending';
  error?: string;
};