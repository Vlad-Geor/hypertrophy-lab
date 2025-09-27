import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeConfig, IconType, Size } from '@ikigaidev/model';
import { IconComponent } from '../../icon/icon.component';
// import { Icon } from '@shared/nds/model/icon.type';

@Component({
  selector: 'lib-icon-button',
  imports: [CommonModule, IconComponent],
  template: `
    <lib-icon
      class="h-11 w-11"
      [ngClass]="{
        'bg-secondary text-white': appearance() === 'fill',
        'h-5 w-5': size() === 'sm',
        'h-7 w-7': size() === 'md',
        'h-11 w-11': size() === 'lg',
      }"
      [icon]="icon()"
      [iconSize]="iconSize() ?? 16"
      [fillContainer]="inheritIconFillColor()"
      [onHoverEffect]="onHoverEffect()"
    ></lib-icon>
  `,
  styles: `
    :host {
      @apply inline-flex transition-all ease-out duration-100 rounded-md h-fit hover:cursor-pointer hover:bg-gray-soft;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  badge = input<BadgeConfig>();
  icon = input.required<IconType>();
  iconSize = input<number>();
  size = input<Extract<Size, 'sm' | 'md' | 'lg'>>('lg');
  disabled = input<boolean>();
  appearance = input<'transparent' | 'fill'>('transparent');
  type = input<'button' | 'submit'>('button');
  inheritIconFillColor = input(true);
  onHoverEffect = input<'highlight' | 'color'>('color');
}
