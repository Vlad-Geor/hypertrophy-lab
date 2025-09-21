import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.Dashboard),
    title: 'Personal Dashboard',
  },
  // This is incorrect. Should show a different component with workout statistics, analytics, etc.
  // The Daily workout component is for actual workouts, in the workout feature.
  {
    path: 'workouts',
    loadComponent: () =>
      import('@ikigaidev/hl/daily-workout').then((m) => m.DailyWorkout),
    title: 'Workouts Overview',
  },
];
