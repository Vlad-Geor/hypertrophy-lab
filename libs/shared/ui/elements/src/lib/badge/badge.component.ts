import { Component, computed, input } from '@angular/core';
import { Theme } from '@ikigaidev/model';

@Component({
  selector: 'lib-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  host: {
    '[class]': `hostClasses()`,
  },
})
export class BadgeComponent {
  badgeType = input<'status' | 'counter'>('status');
  counterValue = input<number>();
  theme = input<Theme>('secondary');

  hostClasses = computed(() => `${this.theme()} ${this.badgeType()}`);
}
