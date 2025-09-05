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
      [inheritCurrentColor]="inheritIconFillColor()"
    ></lib-icon>
  `,
  styles: `
    :host {
      @apply inline-flex hover:cursor-pointer rounded-full hover:bg-gray-soft;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  badge = input<BadgeConfig>();
  icon = input.required<IconType>();
  disabled = input<boolean>();
  appearance = input<'transparent' | 'fill'>('transparent');
  type = input<'button' | 'submit'>('button');
  inheritIconFillColor = input(true);
}
