import { ActivatedRouteSnapshot } from '@angular/router';

export type Crumb =
  | string
  | { label: string; icon?: string; url?: string }
  | ((s: ActivatedRouteSnapshot) => string);

export interface RouteMeta {
  breadcrumb?: Crumb; // label or factory
  header?: string | ((s: ActivatedRouteSnapshot) => string);
  icon?: string;
  order?: number; // optional for sibling sort
  hideInBreadcrumbs?: boolean; // e.g., auxiliary, auth screens
  backOverride?: string; // force back target
}
