import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IconType } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-surface-card',
  imports: [IconComponent, DatePipe],
  template: `
    @if (cardTitle()) {
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
          <ng-content select="[surfaceCardTag]"></ng-content>
        </div>
        <p class="text-sm text-nowrap text-gray-text">
          {{ cardSubtitle() }}
        </p>
      </div>
    }

    <ng-content></ng-content>
  `,
  host: {
    class:
      'w-full h-full px-6 pt-6 pb-4 flex flex-col gap-4 bg-surface border border-gray-soft rounded-lg shadow-xl justify-center',
  },
})
export class SurfaceCard {
  cardTitle = input<string>();
  titleSize = input<'md' | 'lg'>('md');
  cardSubtitle = input<string>();
  cardTitleIcon = input<IconType>();
  cardTitleIconClass = input<string>();
}
