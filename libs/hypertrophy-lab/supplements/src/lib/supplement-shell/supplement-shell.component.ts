import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconComponent } from '@ikigaidev/elements';

@Component({
  template: `
    <div class="bg-gray-soft rounded-lg p-1 flex gap-1 text-white w-fit">
      <div class="flex-center gap-2 py-1.5 px-3">
        <lib-icon [icon]="'cart-liner'"></lib-icon>
        <a
          class=""
          routerLink="/supplements"
          routerLinkActive="tab-active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          Catalog
        </a>
      </div>
      <div class="flex-center gap-2 py-1.5 px-3">
        <lib-icon [icon]="'book-liner'"></lib-icon>
        <a routerLink="/supplements/inventory" routerLinkActive="tab-active">Inventory</a>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  host: {
    style: `@apply flex flex-col gap-3`,
  },
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
})
export class SupplementShellComponent {}
