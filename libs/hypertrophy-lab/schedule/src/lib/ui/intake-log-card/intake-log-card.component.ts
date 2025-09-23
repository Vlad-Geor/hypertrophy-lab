import { Component } from '@angular/core';
import {
  ButtonComponent,
  IconComponent,
  IconTile,
  TagComponent,
} from '@ikigaidev/elements';

@Component({
  selector: 'hl-intake-action-card',
  template: `
    <div class="flex gap-3">
      <lib-icon-tile [icon]="'box-liner'"></lib-icon-tile>
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">Omega 3</span>
          <lib-tag [rounded]="true" [size]="'md'" [theme]="'secondary'">1 unit</lib-tag>
        </div>
        <p class="text-gray-text font-medium text-xs truncate">
          Take with breakfast for better absorption
        </p>
      </div>
    </div>
    <div class="flex gap-3 justify-between">
      <lib-button appearance="outline" [fillContainer]="true">
        <lib-icon [icon]="'close-circle-liner'"></lib-icon>
        Skip
      </lib-button>
      <lib-button theme="success-bright" [fillContainer]="true">
        <lib-icon [icon]="'check-circle-broken-liner'"></lib-icon>
        Take
      </lib-button>
    </div>
  `,
  imports: [IconTile, TagComponent, ButtonComponent, IconComponent],
  host: {
    class: 'flex flex-col gap-3 bg-surface-2 p-3 pb-4 rounded-lg',
  },
})
export class IntakeLogCard {}
