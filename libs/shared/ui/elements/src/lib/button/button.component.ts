import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ThemeColoredComponent } from '@ikigaidev/directive';
import { BadgeConfig, IconType, ThemeColorToken } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'button[lib-button]',
  imports: [CommonModule, IconComponent],
  template: `
    <lib-icon
      [icon]="icon()"
      [iconColor]="iconColor()"
      [iconSize]="iconSize()"
    ></lib-icon>
    <ng-content></ng-content>
  `,
  host: {
    class: `text-caption inline-flex justify-center items-center gap-1 px-2
     py-1 rounded-md border-primary cursor-pointer
      border w-fit hover:bg-gray-200 transition font-medium`,
    '[attr.type]': 'type()',
    '[disabled]': 'disabled()',
  },
})
export class ButtonComponent extends ThemeColoredComponent {
  bgColor = input<ThemeColorToken>('primary.DEFAULT');
  badge = input<BadgeConfig>();
  icon = input<IconType>();
  iconColor = input<ThemeColorToken>('accent.DEFAULT');
  iconSize = input<number>();
  disabled = input<boolean>();
  type = input<'button' | 'submit'>('button');
}
