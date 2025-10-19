import cron from 'node-cron';
import { sendDueRemindersService } from '../services/supplement-intake-notifier.service.js';

export const notifierTask = cron.schedule(
  '* * * * *',
  () => void sendDueRemindersService(),
  { timezone: 'UTC' },
);

notifierTask.stop();
