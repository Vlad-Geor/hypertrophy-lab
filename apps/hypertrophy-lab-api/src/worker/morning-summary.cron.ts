import cron from 'node-cron';
import { sendMorningSummaries } from '../services/morning-summary.service.js';

export const morningTask = cron.schedule('* * * * *', () => void sendMorningSummaries());
