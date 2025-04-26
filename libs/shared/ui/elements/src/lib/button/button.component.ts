import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ThemeColoredComponent } from '@ikigaidev/directive';
import { BadgeConfig, IconType, ThemeColorToken } from '@ikigaidev/model';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'lib-button',
  imports: [CommonModule, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  host: {
    style: `border: 1px solid var(--color-border-primary);`,
    class: 'text-caption inline-flex justify-center px-2 py-1 rounded-md border-primary',
  },
})
export class ButtonComponent extends ThemeColoredComponent {
  bgColor = input<ThemeColorToken>('primary.DEFAULT');
  badge = input<BadgeConfig>();
  icon = input<IconType>();
  iconColor = input<ThemeColorToken>('accent.DEFAULT');
  iconSize = input<number>();
}
