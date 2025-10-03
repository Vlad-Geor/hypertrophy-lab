import { CommonModule } from '@angular/common';
import { Component, effect, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { IconComponent } from '@ikigaidev/elements';
import { filter, map } from 'rxjs';
import { SupplementStore } from '../data-access/supplement.store';
import { SupplementHeaderComponent } from './supplement-header/supplement-header.component';

@Component({
  template: `
    <div class="bg-gray-soft rounded-lg p-1 flex gap-1 text-white">
      <a
        class="tab"
        routerLink="/supplements"
        routerLinkActive="tab-active"
        [routerLinkActiveOptions]="{ exact: true }"
        #suppRla="routerLinkActive"
        [class.active]="suppRla.isActive"
      >
        <lib-icon
          [icon]="'cart-liner'"
          class="hover:text-white"
          [ngClass]="suppRla.isActive ? 'text-secondary' : 'text-muted-02'"
        ></lib-icon>
        <span>Catalog</span>
      </a>
      <a
        class="tab hover:text-white"
        routerLink="/supplements/inventory"
        routerLinkActive="tab-active"
        #inventoryRla="routerLinkActive"
        [class.active]="inventoryRla.isActive"
      >
        <lib-icon
          [icon]="'book-liner'"
          [ngClass]="inventoryRla.isActive ? 'text-secondary' : 'text-muted-02'"
        ></lib-icon>
        <span>Inventory</span>
      </a>
    </div>

    <hl-supplement-header [headerFor]="route()"></hl-supplement-header>

    <router-outlet></router-outlet>
  `,
  styles: `
    :host {
      @apply flex flex-col items-center gap-3;
    }

    .tab {
      @apply flex items-center gap-2 py-1.5 px-3 rounded-md text-muted-02 [&:hover:not(.active)]:bg-gray-soft;

      &.active {
        @apply bg-bg text-white;
      }
    }
  `,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    IconComponent,
    CommonModule,
    SupplementHeaderComponent,
  ],
})
export class SupplementShellComponent {
  readonly router = inject(Router);
  readonly supplementStore = inject(SupplementStore);

  readonly routeUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(
        () =>
          this.router.url.split('?')[0].split('#')[0].split('/').filter(Boolean).pop() ??
          '',
      ),
      map((url) => (url === 'supplements' ? 'catalog' : url)),
    ),
  );
  readonly route = linkedSignal<'inventory' | 'catalog'>(() =>
    this.routeUrl() === 'catalog' ? 'catalog' : 'inventory',
  );

  constructor() {
    this.route.set(
      this.router.routerState.snapshot.url.endsWith('inventory')
        ? 'inventory'
        : 'catalog',
    );
    this.supplementStore.getUserSupplements(false);
  }
}
