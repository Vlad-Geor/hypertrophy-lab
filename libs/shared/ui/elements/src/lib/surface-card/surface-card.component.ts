import { DatePipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { IconType, Theme } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-surface-card',
  imports: [IconComponent, DatePipe, NgClass],
  template: `
    @if (cardTitle()) {
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2 text-token" [attr.data-tone]="theme()">
          <lib-icon [icon]="cardTitleIcon()" [class]="cardTitleIconClass()"></lib-icon>
          <h1
            [class]="
              titleSize() === 'md'
                ? 'text-heading-md-semibold'
                : titleSize() === 'sm'
                  ? 'text-heading-sm-semibold'
                  : 'text-heading-semibold'
            "
            [ngClass]="{ 'text-white': cardTitleWhite() }"
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
  titleSize = input<'sm' | 'md' | 'lg'>('md');
  cardSubtitle = input<string>();
  cardTitleIcon = input<IconType>();
  cardTitleIconClass = input<string>();
  cardTitleWhite = input(false);
  theme = input<Theme>('white');
}
