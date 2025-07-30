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
    @if (icon()) {
      <lib-icon
        [ngClass]="{ 'bg-secondary-light text-white': appearance() === 'fill' }"
        [icon]="icon()"
        [iconSize]="iconSize()"
      ></lib-icon>
    }

    <ng-content></ng-content>
  `,
  host: {
    class: `text-caption inline-flex justify-center items-center gap-1 px-2
     py-1 rounded-md hover:cursor-pointer w-fit transition font-medium`,
    '[attr.type]': 'type()',
    '[disabled]': 'disabled()',
    '[class]': 'appearance() === "fill" ? "bg-secondary-light text-primary-dark" : ""',
  },
})
export class ButtonComponent extends ThemeColoredComponent {
  bgColor = input<ThemeColorToken>('primary.DEFAULT');
  badge = input<BadgeConfig>();
  icon = input<IconType>();
  iconSize = input<number>();
  disabled = input<boolean>();
  appearance = input<'transparent' | 'fill'>('transparent');
  type = input<'button' | 'submit'>('button');
}
