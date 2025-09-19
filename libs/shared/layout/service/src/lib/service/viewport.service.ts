import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';

type Platform = 'mobile' | 'tablet' | 'laptop' | 'desktop';

const QUERIES = {
  mobile: '(max-width: 439.98px)',
  tablet: '(min-width: 440px) and (max-width: 959.98px)',
  laptop: '(min-width: 960px) and (max-width: 1439.98px)',
  desktop: '(min-width: 1440px)',
} as const;

@Injectable({ providedIn: 'root' })
export class ViewportService {
  private bpo = inject(BreakpointObserver);

  private platform$ = this.bpo.observe(Object.values(QUERIES)).pipe(
    map((s) => s.breakpoints),
    map((bp) =>
      bp[QUERIES.mobile]
        ? 'mobile'
        : bp[QUERIES.tablet]
          ? 'tablet'
          : bp[QUERIES.laptop]
            ? 'laptop'
            : 'desktop',
    ),
    distinctUntilChanged(),
  );

  readonly platform = toSignal<Platform>(this.platform$);

  readonly isMobile = computed(() => this.platform() === 'mobile');
  readonly isTablet = computed(() => this.platform() === 'tablet');
  readonly isLaptop = computed(() => this.platform() === 'laptop');
  readonly isDesktop = computed(() => this.platform() === 'desktop');
}
