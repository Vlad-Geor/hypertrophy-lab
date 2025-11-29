import { Feature } from './routes';

export const API = {
  logs: '/schedule/logs',
  dashboard: '/dashboard',
  orders: '/orders',
  routine: '/routine',
  schedule: '/schedule',
  supplements: '/supplements',
  inventory: '/inventory',
  'add-supplement': '/add-supplement',
} as const satisfies Record<Feature, string>;

export type ApiPath = (typeof API)[keyof typeof API];

