import { Component, input } from '@angular/core';
import { IconType, Theme } from '@ikigaidev/model';
import { BadgeComponent } from '../badge/badge.component';
import { IconButtonComponent } from '../button/icon-button/icon-button.component';

@Component({
  selector: 'lib-stateful-icon-button',
  template: `
    <lib-icon-button [icon]="'bell-solid'"></lib-icon-button>
    <lib-badge
      class="absolute top-2.5 right-3"
      [theme]="badgeTheme() ?? 'primary'"
    ></lib-badge>
  `,
  styles: `
    :host {
      @apply inline-flex items-center relative h-fit rounded-full hover:bg-gray-soft;
    }
  `,
  imports: [IconButtonComponent, BadgeComponent, IconButtonComponent],
  host: {
    role: 'button',
  },
})
export class StatefulIconComponent {
  icon = input.required<IconType | undefined>();
  color = input<string>('inherit');
  iconSize = input<number>();
  badgeTheme = input<Theme>();
  iconCurrentColor = input(true);
}
