import { Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PlaygroundComponent } from '@ikigaidev/playground';
import { ShellComponent } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadComponent: () => import('@ikigaidev/hl/login').then((m) => m.LoginComponent),
  },
  {
    path: 'login-success',
    redirectTo: 'inventory',
    // loadComponent: () => import('@ikigaidev/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@ikigaidev/hl/dashboard').then((m) => m.dashboardRoutes),
      },
      {
        path: 'workout',
        loadComponent: () =>
          import('@ikigaidev/hl/daily-workout').then((m) => m.DailyWorkoutComponent),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('@ikigaidev/hl/supplements').then((m) => m.SupplementListComponent),
      },
      {
        path: 'supplements',
        loadChildren: () =>
          import('@ikigaidev/hl/supplements').then((m) => m.supplementRoutes),
      },
    ],
  },
  {
    path: 'pg',
    component: PlaygroundComponent,
  },
  { path: '**', redirectTo: 'login' },
];
