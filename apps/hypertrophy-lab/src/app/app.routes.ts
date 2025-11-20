import { ActivatedRouteSnapshot, Route } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { PlaygroundComponent } from '@ikigaidev/playground';
import { route, RouteMeta } from '@ikigaidev/router';
import { isDevModeGuard } from '@ikigaidev/tech-debt';
import { Shell } from './shell/shell.component';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadComponent: () => import('@ikigaidev/hl/login').then((m) => m.LoginPage),
  },
  {
    path: 'login-success',
    redirectTo: 'inventory',
    // loadComponent: () => import('@ikigaidev/dashboard').then((m) => m.DashboardComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('@ikigaidev/hl/login').then((m) => m.LoginSuccessCallback),
  },
  {
    path: '',
    component: Shell,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@ikigaidev/hl/dashboard').then((m) => m.dashboardRoutes),
        data: {
          meta: {
            breadcrumb: (s: ActivatedRouteSnapshot) => s.params['id'],
            header: 'Dashboard',
            icon: 'pen-liner',
          },
        },
      },
      {
        path: 'workout',
        loadComponent: () =>
          import('@ikigaidev/hl/daily-workout').then((m) => m.DailyWorkout),
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('@ikigaidev/hl/supplements').then((m) => m.SupplementList),
      },
      {
        path: 'supplements',
        loadChildren: () =>
          import('@ikigaidev/hl/supplements').then((m) => m.supplementRoutes),
        data: { meta: { header: 'Supplements' } as RouteMeta },
      },
      route({
        path: 'new-supplement',
        loadComponent: () =>
          import('@ikigaidev/hl/supplements').then((m) => m.CreateSupplementComponent),
        data: { meta: { header: 'Add Supplement' } },
      }),
      {
        path: 'orders',
        loadComponent: () => import('@ikigaidev/hl/orders').then((m) => m.Orders),
      },
      {
        path: 'routine',
        loadComponent: () => import('@ikigaidev/hl/routine').then((m) => m.Routine),
      },
      {
        path: 'schedule',
        loadComponent: () => import('@ikigaidev/hl/schedule').then((m) => m.Schedule),
      },
      {
        path: 'tech-debt',
        loadComponent: () => import('@ikigaidev/tech-debt').then((m) => m.TechDebt),
        canMatch: [isDevModeGuard],
      },
    ],
  },
  {
    path: 'pg',
    component: PlaygroundComponent,
  },
  { path: '**', redirectTo: 'login' },
];
