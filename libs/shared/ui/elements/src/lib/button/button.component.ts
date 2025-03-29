import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeConfig, ThemeColor } from '@ikigaidev/model';
import { IconComponent, IconType } from '../icon/icon.component';

@Component({
  selector: 'lib-button',
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
color = input<ThemeColor>();
badge = input<BadgeConfig>();
icon = input<IconType>();
iconColor = input<ThemeColor>();
}
