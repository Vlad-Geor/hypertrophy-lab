import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { BadgeConfig, IconType, ThemeColor } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-button',
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  bgColor = input<ThemeColor>();
  badge = input<BadgeConfig>();
  icon = input<IconType>();
  iconColor = input<ThemeColor>('accent.DEFAULT');
  iconSize = input<number>();
}
