import { Route } from '@angular/router';
import { PlaygroundComponent } from '@ikigaidev/playground';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('@ikigaidev/dashboard').then((m) => m.dashboardRoutes),
      },
      {
        path: 'workout',
        loadComponent: () =>
          import('@ikigaidev/hl/daily-workout').then((m) => m.DailyWorkoutComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'nutrition',
    loadComponent: () => import('@ikigaidev/nutrition').then((m) => m.NutritionComponent),
  },
  {
    path: 'pg',
    component: PlaygroundComponent,
  },
  { path: '**', redirectTo: '' },
];
