import { RouteMeta } from '@ikigaidev/route';
export {};

declare module '@angular/router' {
  interface Route {
    data?: Data & { meta?: RouteMeta };
  }
}
