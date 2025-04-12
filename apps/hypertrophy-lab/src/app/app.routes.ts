import { Route } from '@angular/router';
import { PlaygroundComponent } from '@ikigaidev/playground';
import { DashboardShellComponent } from './dashboard-shell/shell.component';
import { FeatureShellComponent } from './feature-shell/feature-shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@ikigaidev/dashboard').then((m) => m.dashboardRoutes),
      },
      {
        path: 'workout',
        loadComponent: () =>
          import('@ikigaidev/hl/daily-workout').then((m) => m.DailyWorkoutComponent),
      },
    ],
  },
  {
    path: '',
    component: FeatureShellComponent,
    children: [
      {
        path: 'inventory',
        loadComponent: () =>
          import('@ikigaidev/supplements').then((m) => m.SupplementListComponent),
      },
    ],
  },
  {
    path: 'pg',
    component: PlaygroundComponent,
  },
  { path: '**', redirectTo: '' },
];
