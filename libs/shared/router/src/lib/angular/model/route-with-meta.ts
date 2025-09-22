// shared/router/route-with-meta.ts
import { Data, Route } from '@angular/router';
import { RouteMeta } from './route-meta';

export type RouteWithMeta = Omit<Route, 'data'> & {
  data?: Data & { meta?: RouteMeta };
};

export const route = (r: RouteWithMeta) => r;
