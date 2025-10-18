import cron from 'node-cron';
import { sendDueRemindersService } from '../services/notifier.service.js';

cron.schedule('* * * * *', () => void sendDueRemindersService());
export default null;
