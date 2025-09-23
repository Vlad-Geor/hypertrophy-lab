import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IconComponent } from '@ikigaidev/elements';
import { IconType } from '@ikigaidev/model';

@Component({
  selector: 'hl-surface-card',
  imports: [IconComponent, DatePipe],
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <lib-icon [icon]="cardTitleIcon()" [class]="cardTitleIconClass()"></lib-icon>
        <h1
          class="text-white"
          [class]="
            titleSize() === 'md' ? 'text-heading-md-semibold' : 'text-heading-semibold'
          "
        >
          {{ cardTitle() }}
        </h1>
      </div>
      <p class="text-sm text-nowrap text-gray-text">
        {{ cardSubtitle() }}
      </p>
    </div>

    <ng-content></ng-content>
  `,
  host: {
    class:
      '@apply px-6 pt-6 pb-4 flex flex-col gap-4 bg-surface border border-gray-soft rounded-lg shadow-xl',
  },
})
export class SurfaceCard {
  cardTitle = input<string>();
  titleSize = input<'md' | 'lg'>('md');
  cardSubtitle = input<string>();
  cardTitleIcon = input<IconType>();
  cardTitleIconClass = input<string>();
}
