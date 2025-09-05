import { Route } from '@angular/router';

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
      {
        path: 'inventory',
        loadComponent: () =>
          import('./supplement-shell/user-supplements/user-supplements.component').then(
            (m) => m.SupplementListComponent,
          ),
      },
    ],
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./supplement-shell/user-supplements/user-supplements.component').then(
        (m) => m.SupplementListComponent,
      ),
  },
];
