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
      {
        path: 'supplements',
        loadComponent: () =>
          import('@ikigaidev/supplements').then((m) => m.SupplementsComponent),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
},
  {
    path: 'pg',
    component: PlaygroundComponent,
  },
  { path: '**', redirectTo: '' },
];
