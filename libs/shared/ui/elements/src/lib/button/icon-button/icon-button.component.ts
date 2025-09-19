import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeConfig, IconType } from '@ikigaidev/model';
import { IconComponent } from '../../icon/icon.component';
// import { Icon } from '@shared/nds/model/icon.type';

@Component({
  selector: 'lib-icon-button',
  imports: [CommonModule, IconComponent],
  template: `
    <lib-icon
      class="h-11 w-11"
      [ngClass]="{ 'bg-secondary text-white': appearance() === 'fill' }"
      [icon]="icon()"
      [fillContainer]="inheritIconFillColor()"
    ></lib-icon>
  `,
  styles: `
    :host {
      @apply inline-flex rounded-full hover:cursor-pointer h-fit;
      &.color-on-hover {
        @apply hover:text-text-3;
      }
      &.highlight-on-hover {
        @apply hover:bg-gray-soft;
      }
    }
  `,
  host: {
    '[class.color-on-hover]': 'onHoverEffect() === "color"',
    '[class.highlight-on-hover]': 'onHoverEffect() === "highlight"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  badge = input<BadgeConfig>();
  icon = input.required<IconType>();
  disabled = input<boolean>();
  appearance = input<'transparent' | 'fill'>('transparent');
  type = input<'button' | 'submit'>('button');
  inheritIconFillColor = input(true);
  onHoverEffect = input<'highlight' | 'color'>('color');
}
