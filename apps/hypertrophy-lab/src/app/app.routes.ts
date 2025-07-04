import { Route } from '@angular/router';
import { PlaygroundComponent } from '@ikigaidev/playground';
import { DashboardShellComponent } from './dashboard-shell/shell.component';
import { FeatureShellComponent } from './feature-shell/feature-shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadComponent: () => import('@ikigaidev/login').then((m) => m.LoginComponent),
  },
  {
    path: 'login-success',
    redirectTo: 'inventory',
    // loadComponent: () => import('@ikigaidev/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: '',
    component: DashboardShellComponent,
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
    ],
  },
  {
    path: '',
    component: FeatureShellComponent,
    children: [
      {
        path: 'inventory',
        loadComponent: () =>
          import('@ikigaidev/supplements').then((m) => m.UserSupplementsComponent),
      },
    ],
  },
  {
    path: 'pg',
    component: PlaygroundComponent,
  },
  { path: '**', redirectTo: 'login' },
];
