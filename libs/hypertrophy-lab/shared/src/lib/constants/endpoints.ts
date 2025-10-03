import { Feature } from './routes';

export const API: Record<Feature, string> = {
  logs: '/schedule/logs',
  dashboard: '/dashboard',
  orders: '/orders',
  routine: '/routine',
  schedule: '/schedule',
  supplements: '/supplements',
  inventory: '/inventory',
  'add-supplement': '/add-supplement',
} as const;
