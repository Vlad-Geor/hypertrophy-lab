import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouteMeta } from '../model/route-meta';

@Injectable({ providedIn: 'root' })
export class RouterMetaService {
  private router = inject(Router);

  private snap = signal<ActivatedRouteSnapshot | null>(null);
  private stack = signal<string[]>([]); // in-app nav stack

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.snap.set(this.router.routerState.snapshot.root);
      this.pushStack(this.router.url);
    });
  }

  private pushStack(url: string) {
    const s = this.stack();
    const last = s.length ? s[s.length - 1] : undefined;
    if (last !== url) this.stack.set([...s, url]);
  }

  // flatten primary route tree
  private chain = computed(() => {
    const out: ActivatedRouteSnapshot[] = [];
    let n = this.snap();
    while (n) {
      out.push(n);
      n = n.firstChild ?? null;
    }
    return out;
  });

  // helpers
  private metaOf = (s: ActivatedRouteSnapshot) => (s.data?.['meta'] ?? {}) as RouteMeta;
  private eval = <T>(
    v: T | ((s: ActivatedRouteSnapshot) => T),
    s: ActivatedRouteSnapshot,
  ): T => (typeof v === 'function' ? (v as any)(s) : v);

  breadcrumbs = computed(() => {
    const segs = this.chain();
    const items = segs
      .filter((s) => !this.metaOf(s).hideInBreadcrumbs)
      .map((s, idx) => {
        const m = this.metaOf(s);
        let label: string | undefined;
        const b = m.breadcrumb;
        if (typeof b === 'string') label = b;
        else if (typeof b === 'function') label = this.eval(b, s);
        else if (b && typeof b === 'object') label = b.label;
        // url: join pathFromRoot up to idx
        const url =
          '/' +
          segs
            .slice(1, idx + 1)
            .map((x) => x.url.map((u) => u.path).join('/'))
            .filter(Boolean)
            .join('/');
        return { label: label ?? s.routeConfig?.path ?? '', url, icon: m.icon };
      });
    return items;
  });

  pageHeader = computed(() => {
    const chain = this.chain();
    const last = chain.length ? chain[chain.length - 1] : undefined;
    if (!last) return '';
    const m = this.metaOf(last);
    if (m.header) return this.eval(m.header, last);
    if (m.breadcrumb) {
      const b = m.breadcrumb;
      return typeof b === 'string'
        ? b
        : typeof b === 'function'
          ? this.eval(b, last)
          : b.label;
    }
    return last.routeConfig?.path ?? '';
  });

  backTarget = computed(() => {
    const chain = this.chain();
    const last = chain.length ? chain[chain.length - 1] : undefined;
    const override = last ? this.metaOf(last).backOverride : undefined;
    if (override) return override;

    const s = this.stack();
    // prefer in-app previous url
    if (s.length > 1) return s[s.length - 2];

    // fallback: parent url
    const bc = this.breadcrumbs();
    if (bc.length > 1) return bc[bc.length - 2].url || '/';

    // last fallback
    return '/';
  });

  // imperative navigation
  goBack(opts?: { replace?: boolean }) {
    this.router.navigateByUrl(this.backTarget(), { replaceUrl: !!opts?.replace });
  }
}
