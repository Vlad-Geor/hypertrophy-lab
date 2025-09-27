import { Route } from '@angular/router';
import { route, RouteMeta } from '@ikigaidev/router';

export const supplementRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./supplement-shell/supplement-shell.component').then(
        (m) => m.SupplementShellComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./supplement-shell/all-supplements/all-supplements.component').then(
            (m) => m.AllSupplementsComponent,
          ),
      },
      route({
        path: 'inventory',
        loadComponent: () =>
          import('./supplement-shell/user-supplements/user-supplements.component').then(
            (m) => m.SupplementList,
          ),
        data: { meta: { header: 'Supplements' } as RouteMeta },
      }),
    ],
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./supplement-shell/user-supplements/user-supplements.component').then(
        (m) => m.SupplementList,
      ),
  },
];
