import { Component, input } from '@angular/core';
import { IconType, Theme } from '@ikigaidev/model';
import { BadgeComponent } from '../badge/badge.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-stateful-icon',
  template: `
    <lib-icon [icon]="icon()" [color]="color()" [iconSize]="iconSize()"></lib-icon>
    <lib-badge
      class="absolute top-0 right-0 translate-x-[45%] -translate-y-[40%]"
      [theme]="badgeTheme() ?? 'primary'"
    ></lib-badge>
  `,
  styles: `
    :host {
      @apply inline-flex items-center relative h-fit;
    }
  `,
  imports: [IconComponent, BadgeComponent],
  host: {
    role: 'button',
  },
})
export class StatefulIconComponent {
  icon = input.required<IconType | undefined>();
  color = input<string>('inherit');
  iconSize = input<number>();
  badgeTheme = input<Theme>();
}
