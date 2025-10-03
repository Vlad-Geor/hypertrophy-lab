export const FEATURES = [
  'supplements',
  'inventory',
  'dashboard',
  'schedule',
  'logs',
  'add-supplement',
  'routine',
  'orders',
] as const;
export type Feature = (typeof FEATURES)[number];

export const ROUTES: Record<Feature, string> = {
  schedule: 'schedule-route-name',
  routine: 'routine-route-name',
  logs: '',
  dashboard: '',
  orders: '',
  supplements: '',
  'add-supplement': '',
  inventory: '',
} as const;
